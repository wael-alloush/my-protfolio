import { mcpResult } from "@/lib/agent";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: cors });
}

type Rpc = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

async function reply(message: Rpc) {
  if (message.id === undefined || message.id === null) return null;
  let result: Awaited<ReturnType<typeof mcpResult>>;
  try {
    result = await mcpResult(String(message.method ?? ""), message.params);
  } catch (error) {
    // تعذّر قراءة المحتوى (مثلاً انقطاع قاعدة البيانات): رد JSON-RPC سليم بدل خطأ خادم.
    console.error(error);
    return {
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32603, message: "Internal error" },
    };
  }
  if (result === undefined) {
    return {
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: "Method not found" },
    };
  }
  return { jsonrpc: "2.0", id: message.id, result };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export function GET() {
  return json({
    name: "wa-studio",
    transport: "streamable-http",
    message: "Send a JSON-RPC POST request to use this MCP server.",
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      400,
    );
  }

  if (Array.isArray(body)) {
    const responses = (
      await Promise.all(body.map((item) => reply(item as Rpc)))
    ).filter((item) => item !== null);
    if (responses.length === 0) return new Response(null, { status: 202, headers: cors });
    return json(responses);
  }

  const response = await reply(body as Rpc);
  if (!response) return new Response(null, { status: 202, headers: cors });
  return json(response);
}
