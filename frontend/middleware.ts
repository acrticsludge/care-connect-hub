import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Explicit route list — avoids running on every static asset (billing trap)
export const config = {
  matcher: [
    "/check/:path*",
    "/result/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
