"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addComment(postId: string, body: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const trimmed = body.trim();
  if (!trimmed) throw new Error("Comment cannot be empty");
  if (trimmed.length > 1000)
    throw new Error("Comment must be under 1000 characters");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    body: trimmed,
  });

  if (error) throw new Error(error.message);

  // Notify post owner (not self)
  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();
  if (post && post.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: post.user_id,
      actor_id: user.id,
      type: "comment",
      post_id: postId,
    });
  }

  revalidatePath(`/posts/${postId}`);
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check if already liked
  const { data: existing } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id });

    // Notify post owner (not self)
    const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();
    if (post && post.user_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: post.user_id,
        actor_id: user.id,
        type: "like",
        post_id: postId,
      });
    }
  }

  revalidatePath("/feed");
  revalidatePath(`/posts/${postId}`);
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/posts/${postId}`);
}

export async function markNotificationsRead() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/notifications");
}
