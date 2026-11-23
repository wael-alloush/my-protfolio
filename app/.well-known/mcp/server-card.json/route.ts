import { serverCard } from "@/lib/agent";

export function GET() {
  return Response.json(serverCard(), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
