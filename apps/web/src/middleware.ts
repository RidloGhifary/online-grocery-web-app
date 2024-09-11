import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

const protectedRoutes = [
  "/user",
  "/cart",
  "/my-vouchers",
  "/checkout",
  "/transaction",
];
const adminRoutes = ["/create-store", "/admin"];
const authRoutes = ["/login", "/register", "/verify-account"];

export default function middleware(req: NextRequest) {
  const token = cookies().get("token")?.value;

  let decoded: (JwtPayload & { role?: string }) | null = null;
  let isAdmin = false;
  let isLoggedIn = false;

  try {
    if (token) {
      decoded = jwtDecode<JwtPayload & { email: string }>(token);
      isLoggedIn = true;
      isAdmin = decoded.role?.includes("admin") || false;
    }
  } catch (error) {
    console.error("JWT decoding error:", error);
  }

  const path = req.nextUrl.pathname;

  if (!isLoggedIn) {
    // Deny access to protected and adminRoutes
    if (
      protectedRoutes.some((route) => path.startsWith(route)) ||
      adminRoutes.some((route) => path.startsWith(route))
    ) {
      const callbackUrl = req.nextUrl.search
        ? `${path}${req.nextUrl.search}`
        : path;
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      const redirectUrl = `/login?callbackUrl=${encodedCallbackUrl}`;
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  } else if (isAdmin) {
    // Redirect SuperAdmins away from authRoutes and protectedRoutes
    if (authRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (protectedRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } else {
    // Regular users handling
    if (adminRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/user/settings", req.url)); // Redirect regular users from adminRoutes
    }

    if (authRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect logged-in users from authRoutes
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
