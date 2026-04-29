import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/page-shell";
import { signIn } from "./actions";

interface Props {
  searchParams: Promise<{ error?: string; message?: string; redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, message, redirectTo } = await searchParams;

  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center mb-3">
            <Activity size={24} strokeWidth={2.5} className="text-[#1C1A0F]" />
          </div>
          <div className="text-[15px] font-bold text-[#1C1A0F]">CareConnectHub</div>
          <div className="text-[9px] font-bold text-[#D4A810] tracking-[0.07em] uppercase mt-0.5">
            AI Health Assistant
          </div>
        </div>

        <Card className="border border-[#FDE68A] shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-[22px] font-bold text-[#1C1A0F] tracking-[-0.01em]">
              Sign in
            </CardTitle>
            <CardDescription className="text-[14px] text-[#57522A]">
              Welcome back. Enter your credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#B91C1C]">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 rounded-lg border border-[#FDE68A] bg-[#FEFCE8] px-4 py-3 text-[13px] text-[#57522A]">
                {message}
              </div>
            )}

            <form action={signIn} className="flex flex-col gap-5">
              {redirectTo && (
                <input type="hidden" name="redirectTo" value={redirectTo} />
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-[13px] font-medium text-[#57522A]">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="border-[#FDE68A] focus-visible:ring-[#F5C518] min-h-[44px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-[13px] font-medium text-[#57522A]">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="border-[#FDE68A] focus-visible:ring-[#F5C518] min-h-[44px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] min-h-[48px]"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-5 text-center text-[13px] text-[#A39A5C]">
              No account?{" "}
              <Link href="/signup" className="text-[#D4A810] font-medium hover:underline">
                Create one
              </Link>
            </div>
            <div className="mt-4 text-center text-[11px] text-[#A39A5C]">
              <Link href="/" className="hover:underline">Privacy policy</Link>
              {" · "}
              <Link href="/" className="hover:underline">Terms of use</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
