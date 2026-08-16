import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  const sessionCookie = request.cookies.get("JSESSIONID");
  if (!sessionCookie) return NextResponse.redirect(loginUrl);

  try {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/auth/me`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.redirect(loginUrl);
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
