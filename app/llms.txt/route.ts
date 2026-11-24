import { llmsText } from "@/lib/agent";

// يُبنى مسبقاً ويُجدَّد كصفحات الموقع؛ إذا تعذّر التجديد تبقى آخر نسخة سليمة.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  return new Response(await llmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
