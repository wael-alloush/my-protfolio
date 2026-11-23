import { homepageMarkdown, linkHeader } from "@/lib/agent";

export function GET() {
  return new Response(homepageMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: linkHeader(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
