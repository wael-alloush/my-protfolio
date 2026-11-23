import { llmsText } from "@/lib/agent";

export function GET() {
  return new Response(llmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
