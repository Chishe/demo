import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logUserAction } from "@/lib/log";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token && !pathname.startsWith("/login") && !pathname.endsWith(".png")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    const userId = parseInt(token, 10);
    if (!Number.isNaN(userId) && pathname) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      await logUserAction(userId, "page_view", "page", { pathname }, ip);
    } else {
      console.warn("Skipping log-action: invalid token or empty pathname", { token, pathname });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|login|public).*)"],
};
