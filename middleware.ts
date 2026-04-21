import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_TOKEN = "admin-token"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === "/admin/login"
  const token = request.cookies.get(ADMIN_TOKEN)?.value

  if (!isLoginPage && !token) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
