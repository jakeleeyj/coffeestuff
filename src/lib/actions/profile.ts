"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const display_name = (formData.get("display_name") as string) || null;
  const bio = (formData.get("bio") as string) || null;

  if (display_name && display_name.length > 50)
    throw new Error("Display name must be under 50 characters");
  if (bio && bio.length > 300)
    throw new Error("Bio must be under 300 characters");
  const avatarFile = formData.get("avatar") as File;

  const updates: Record<string, string | null> = { display_name, bio };

  // Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > 2 * 1024 * 1024)
      throw new Error("Avatar must be under 2MB");
    const ext = avatarFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const bytes = await avatarFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, bytes, { contentType: avatarFile.type, upsert: true });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(path);
      updates.avatar_url = publicUrl;
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  await supabase.from("profiles").update(updates).eq("id", user.id);

  revalidatePath(`/profile/${profile?.username}`);
  redirect(`/profile/${profile?.username}`);
}
