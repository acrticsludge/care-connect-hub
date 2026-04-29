import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { DisclaimerBar } from "@/components/disclaimer-bar";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareConnectHub AI — Symptom Checker",
  description:
    "AI-powered symptom checker and emergency triage assistant. Understand your symptoms clearly, calmly, and without the guesswork.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-body">
        <NavBar user={user ? { id: user.id, email: user.email } : null} />
        <main className="flex-1">{children}</main>
        <DisclaimerBar />
      </body>
    </html>
  );
}
