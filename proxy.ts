import { linkHeader, prefersMarkdown } from "@/lib/links";
import { resolveRedirect } from "@/lib/redirects";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/";

  if (pathname !== "/") {
    const target = await resolveRedirect(pathname);
    if (target && target !== pathname) {
      return NextResponse.redirect(new URL(target, request.url), 308);
    }
  }

  if (pathname !== "/") return NextResponse.next();

  // من يطلب Markdown يحصل على نسخة /index.md من نفس العنوان.
  const response = prefersMarkdown(request.headers.get("accept") ?? "")
    ? NextResponse.rewrite(new URL("/index.md", request.url))
    : NextResponse.next();

  response.headers.set("Link", linkHeader());
  const vary = response.headers.get("Vary");
  if (!vary) response.headers.set("Vary", "Accept");
  else if (!vary.toLowerCase().includes("accept")) {
    response.headers.set("Vary", `${vary}, Accept`);
  }
  return response;
}

export const config = {
  matcher: ["/", "/blog/:path*", "/services/:path*", "/portfolio/:path*"],
};
