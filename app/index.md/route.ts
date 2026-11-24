import { homepageMarkdown } from "@/lib/agent";
import { linkHeader } from "@/lib/links";

// يُبنى مسبقاً ويُجدَّد كصفحات الموقع؛ إذا تعذّر التجديد تبقى آخر نسخة سليمة.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  return new Response(await homepageMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: linkHeader(),
      Vary: "Accept",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
