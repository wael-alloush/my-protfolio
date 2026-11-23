import { homepageMarkdown, linkHeader, prefersMarkdown } from "@/lib/agent";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();

  const link = linkHeader();

  if (prefersMarkdown(request.headers.get("accept") ?? "")) {
    return new NextResponse(homepageMarkdown(), {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Link: link,
        Vary: "Accept",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Link", link);
  const vary = response.headers.get("Vary");
  if (!vary) response.headers.set("Vary", "Accept");
  else if (!vary.toLowerCase().includes("accept")) {
    response.headers.set("Vary", `${vary}, Accept`);
  }
  return response;
}

export const config = {
  matcher: "/",
};
