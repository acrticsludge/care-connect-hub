"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const ageRaw = formData.get("age") as string;
  const age = ageRaw ? Number(ageRaw) : null;
  const gender = (formData.get("gender") as string) || null;
  const conditionsRaw = (formData.get("conditions") as string) || "";
  const conditions = conditionsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    age,
    gender,
    conditions,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  redirect("/check");
}
