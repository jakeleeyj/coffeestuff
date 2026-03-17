"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBean(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const roaster = (formData.get("roaster") as string).trim();
  const origin = (formData.get("origin") as string)?.trim() || null;
  const roast_level = (formData.get("roast_level") as string)?.trim() || null;

  if (!name || name.length > 100)
    throw new Error("Bean name is required and must be under 100 characters");
  if (!roaster || roaster.length > 100)
    throw new Error("Roaster is required and must be under 100 characters");
  if (origin && origin.length > 100)
    throw new Error("Origin must be under 100 characters");

  const { error } = await supabase
    .from("beans")
    .update({
      name,
      roaster,
      origin,
      roast_level,
    })
    .eq("id", id)
    .eq("added_by", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/beans");
  redirect("/beans");
}

export async function deleteBean(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("beans")
    .delete()
    .eq("id", id)
    .eq("added_by", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/beans");
  redirect("/beans");
}

export async function addBean(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const roaster = (formData.get("roaster") as string).trim();
  const origin = (formData.get("origin") as string)?.trim() || null;
  const roast_level = (formData.get("roast_level") as string)?.trim() || null;

  if (!name || name.length > 100)
    throw new Error("Bean name is required and must be under 100 characters");
  if (!roaster || roaster.length > 100)
    throw new Error("Roaster is required and must be under 100 characters");
  if (origin && origin.length > 100)
    throw new Error("Origin must be under 100 characters");

  const { error } = await supabase.from("beans").insert({
    name,
    roaster,
    origin,
    roast_level,
    added_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/beans");
  redirect("/beans");
}
