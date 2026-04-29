import Link from "next/link";
import { redirect } from "next/navigation";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Other",
  "Prefer not to say",
];

export default async function ProfilePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("age, gender, conditions")
    .eq("id", user.id)
    .single();

  const { error } = await searchParams;

  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center mb-3">
            <UserCircle size={24} strokeWidth={2} className="text-[#1C1A0F]" />
          </div>
          <h1 className="text-[22px] font-bold text-[#1C1A0F] tracking-[-0.01em]">
            Your profile
          </h1>
          <p className="text-[14px] text-[#57522A] mt-1 text-center max-w-[320px]">
            Help us personalize your experience. You can skip this and update later.
          </p>
        </div>

        <Card className="border border-[#FDE68A] shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-[17px] font-bold text-[#1C1A0F]">
              Health details
            </CardTitle>
            <CardDescription className="text-[13px] text-[#57522A]">
              Used only to improve symptom analysis accuracy. Stored securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#B91C1C]">
                {error}
              </div>
            )}

            <form action={updateProfile} className="flex flex-col gap-5">
              {/* Account info */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[13px] font-medium text-[#57522A]">
                  Email
                </Label>
                <div className="text-[14px] text-[#1C1A0F] font-medium px-3 py-2.5 bg-[#FEFCE8] border border-[#FDE68A] rounded-lg min-h-[44px] flex items-center">
                  {user.email}
                </div>
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="age" className="text-[13px] font-medium text-[#57522A]">
                  Age <span className="text-[#A39A5C] font-normal">(optional)</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="e.g. 28"
                  defaultValue={profile?.age ?? ""}
                  className="border-[#FDE68A] focus-visible:ring-[#F5C518] min-h-[44px]"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gender" className="text-[13px] font-medium text-[#57522A]">
                  Gender <span className="text-[#A39A5C] font-normal">(optional)</span>
                </Label>
                <Select name="gender" defaultValue={profile?.gender ?? ""}>
                  <SelectTrigger
                    id="gender"
                    className="border-[#FDE68A] focus:ring-[#F5C518] min-h-[44px]"
                  >
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pre-existing conditions */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="conditions" className="text-[13px] font-medium text-[#57522A]">
                  Pre-existing conditions{" "}
                  <span className="text-[#A39A5C] font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="conditions"
                  name="conditions"
                  placeholder="Diabetes, hypertension, asthma… (comma-separated)"
                  defaultValue={profile?.conditions?.join(", ") ?? ""}
                  className="border-[#FDE68A] focus-visible:ring-[#F5C518] resize-none min-h-[80px] text-[14px]"
                />
                <p className="text-[11px] text-[#A39A5C]">
                  Separate multiple conditions with a comma.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  className="flex-1 bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] min-h-[48px]"
                >
                  Save profile
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] min-h-[48px]"
                >
                  <Link href="/check">Skip for now</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
