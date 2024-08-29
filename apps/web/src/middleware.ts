import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = [
  "/user",
  "/user/settings",
  "/user/address",
  "/cart",
  "/my-vouchers",
];
const authRoutes = ["/login", "/register", "/verify-account"];

export default function middleware(req: NextRequest) {
  const token = cookies().get("token")?.value;
  const isLoggedIn = !!token;

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (!isLoggedIn && isProtectedRoute) {
    const callbackUrl = req.nextUrl.search
      ? `${path}${req.nextUrl.search}`
      : path;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    const redirectUrl = `/login?callbackUrl=${encodedCallbackUrl}`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/user/settings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
