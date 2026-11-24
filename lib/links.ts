import { absoluteUrl } from "@/lib/seo";

/** ترويسة Link (RFC 8288) التي تعلن عن ملخص الموقع ونسخة Markdown. */
export function linkHeader() {
  return [
    `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    `<${absoluteUrl("/index.md")}>; rel="alternate"; type="text/markdown"`,
  ].join(", ");
}

/** Prefer Markdown when the client asks for it more strongly than HTML. */
export function prefersMarkdown(accept: string) {
  const types = accept.split(",").map((part) => {
    const [rawType, ...params] = part.trim().split(";");
    const qParam = params.find((param) => param.trim().toLowerCase().startsWith("q="));
    const q = qParam ? Number(qParam.trim().slice(2)) : 1;
    return {
      type: rawType.trim().toLowerCase(),
      q: Number.isFinite(q) ? q : 0,
    };
  });

  const markdown = types.find(
    (entry) => entry.type === "text/markdown" || entry.type === "text/x-markdown",
  );
  if (!markdown || markdown.q <= 0) return false;

  const html = types.find(
    (entry) => entry.type === "text/html" || entry.type === "application/xhtml+xml",
  );
  if (!html) return true;
  return markdown.q >= html.q;
}
