"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendPushToAll } from "@/lib/push";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Rate limit: max 10 posts per hour
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", new Date(Date.now() - 3600000).toISOString());
  if ((count ?? 0) >= 10) throw new Error("Too many posts — please slow down");

  const caption = (formData.get("caption") as string) || "";
  const recipe = (formData.get("recipe") as string) || "";
  if (caption.length > 500)
    throw new Error("Caption must be under 500 characters");
  if (recipe.length > 2000)
    throw new Error("Recipe must be under 2000 characters");

  const imageFile = formData.get("image") as File;
  if (!imageFile || imageFile.size === 0) throw new Error("Image is required");
  if (imageFile.size > 5 * 1024 * 1024)
    throw new Error("Image must be under 5MB");

  const postId = crypto.randomUUID();
  const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/${postId}.${ext}`;

  const bytes = await imageFile.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(path, bytes, { contentType: imageFile.type });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(path);

  const { error: postError } = await supabase.from("posts").insert({
    id: postId,
    user_id: user.id,
    image_url: publicUrl,
    caption: caption || null,
    brew_method: (formData.get("brew_method") as string) || null,
    recipe: recipe || null,
    dose_grams: formData.get("dose_grams")
      ? Number(formData.get("dose_grams"))
      : null,
    yield_grams: formData.get("yield_grams")
      ? Number(formData.get("yield_grams"))
      : null,
    brew_time_seconds: formData.get("brew_time_seconds")
      ? Number(formData.get("brew_time_seconds"))
      : null,
  });

  if (postError) {
    await supabase.storage.from("post-images").remove([path]);
    throw new Error(postError.message);
  }

  const beanIds = formData.getAll("bean_ids") as string[];
  if (beanIds.length > 10) throw new Error("Maximum 10 beans per post");
  if (beanIds.length > 0) {
    await supabase
      .from("post_beans")
      .insert(beanIds.map((bean_id) => ({ post_id: postId, bean_id })));
  }

  revalidatePath("/feed");

  // Send push notification to all other users (fire-and-forget)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  const username = profile?.username ?? "Someone";
  const pushBody = caption || "a new brew";
  sendPushToAll(
    `${username} shared a brew`,
    pushBody.length > 80 ? pushBody.slice(0, 80) + "…" : pushBody,
    user.id,
  ).catch(() => {}); // don't fail the post if push fails
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("image_url, user_id")
    .eq("id", postId)
    .single();

  if (!post || post.user_id !== user.id) throw new Error("Not authorized");

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);

  // Clean up storage
  if (post.image_url) {
    try {
      const url = new URL(post.image_url);
      const parts = url.pathname.split("/post-images/");
      if (parts[1]) {
        await supabase.storage.from("post-images").remove([parts[1]]);
      }
    } catch {
      /* ignore storage cleanup errors */
    }
  }

  revalidatePath("/feed");
}
