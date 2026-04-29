"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, Activity, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/app/signout/actions";

interface NavUser {
  id: string;
  email?: string;
}

interface NavBarProps {
  user?: NavUser | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/check", label: "Check symptoms" },
  { href: "/history", label: "History" },
  { href: "/hospital-nearby", label: "Hospitals" },
];

export function NavBar({ user }: NavBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-[#FDE68A] flex items-center px-6 md:px-8 justify-between">
      {/* Left: back button on non-home, brand on home */}
      <div className="flex items-center gap-3">
        {!isHome && (
          <Link
            href="javascript:history.back()"
            aria-label="Go back"
            className="mr-1 flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#FEFCE8] transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.5} className="text-[#57522A]" />
          </Link>
        )}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#F5C518] rounded-[9px] flex items-center justify-center shrink-0">
            <Activity size={20} strokeWidth={2.5} className="text-[#1C1A0F]" />
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-bold text-[#1C1A0F] tracking-[-0.01em]">
              CareConnectHub
            </div>
            <div className="text-[9px] font-bold text-[#D4A810] tracking-[0.07em] uppercase">
              AI Health Assistant
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-[14px] font-medium pb-0.5 transition-colors border-b-2",
              pathname === href
                ? "text-[#D4A810] border-[#F5C518]"
                : "text-[#57522A] border-transparent hover:text-[#D4A810]",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop auth CTAs */}
      <div className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <Button asChild variant="ghost" size="sm" className="text-[#57522A] hover:bg-[#FEFCE8] gap-1.5">
              <Link href="/profile">
                <User size={15} strokeWidth={1.5} />
                Profile
              </Link>
            </Button>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] gap-1.5"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant="outline" size="sm" className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8]">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)]"
            >
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <button
            aria-label="Open menu"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#FEFCE8] transition-colors"
          >
            <Menu size={20} strokeWidth={1.5} className="text-[#57522A]" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 bg-white border-l border-[#FDE68A]">
          <div className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-[15px] font-medium px-3 py-2.5 rounded-lg transition-colors min-h-[48px] flex items-center",
                    pathname === href
                      ? "bg-[#FEFCE8] text-[#D4A810]"
                      : "text-[#57522A] hover:bg-[#FEFCE8]",
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 px-1">
              {user ? (
                <>
                  <Button asChild variant="outline" className="border-[#FDE68A] text-[#57522A] min-h-[48px] gap-2">
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <User size={15} strokeWidth={1.5} />
                      Profile
                    </Link>
                  </Button>
                  <form action={signOut} className="w-full">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full border-[#FDE68A] text-[#57522A] min-h-[48px] gap-2"
                    >
                      <LogOut size={14} strokeWidth={1.5} />
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="border-[#FDE68A] text-[#57522A] min-h-[48px]">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] min-h-[48px] shadow-[0_2px_8px_rgba(245,197,24,0.50)]"
                  >
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
