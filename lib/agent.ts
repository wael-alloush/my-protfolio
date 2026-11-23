import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const SERVER_NAME = "wa-studio";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2025-06-18";

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

function pages() {
  return [
    { path: "/", title: "الرئيسية", note: "عرض الخدمات والأعمال ومسار طلب الموقع." },
    { path: "/about", title: "عنّي", note: "مهندس حاسب ومصمم مواقع، خبرة أكثر من 3 سنوات وأكثر من 30 مشروعاً." },
    { path: "/contact", title: "تواصل", note: "التواصل مباشر عبر واتساب، مع البريد والهاتف وإنستغرام." },
    { path: "/terms", title: "الشروط", note: "شروط طلب التصميم والتسليم وحقوق العمل." },
    { path: "/services", title: "الخدمات", note: "مواقع تعريفية، صفحات هبوط، وإعادة تصميم." },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      title: service.title,
      note: service.description,
    })),
    { path: "/portfolio", title: "الأعمال", note: "نماذج من المواقع المنفّذة." },
    ...projects.map((project) => ({
      path: `/portfolio/${project.slug}`,
      title: project.name,
      note: project.summary,
    })),
    { path: "/blog", title: "المدونة", note: "مقالات عن تصميم المواقع والتكلفة وصفحات الهبوط." },
  ];
}

export function homepageMarkdown() {
  const phone = `+${siteConfig.phone}`;
  const lines = [
    `# ${siteConfig.title}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## النشاط",
    "",
    `${siteConfig.name} (${siteConfig.nameEn}) يعمل تحت العلامة ${siteConfig.brand}: ${siteConfig.brandTagline}.`,
    "مهندس حاسب ومصمم مواقع في السعودية. الخبرة أكثر من 3 سنوات، ونفّذ أكثر من 30 مشروعاً.",
    "السعر لا يُنشر كباقات؛ يُطلب عبر واتساب.",
    "",
    "## استخدام المحتوى",
    "",
    "Content-Signal: search=yes, ai-train=no",
    "يُسمح بالفهرسة وعرض مقتطفات في نتائج البحث. لا يُسمح بتدريب نماذج الذكاء الاصطناعي على المحتوى.",
    "",
    "## التواصل",
    "",
    `- واتساب: ${siteConfig.social.whatsapp}`,
    `- الهاتف: ${phone}`,
    `- البريد: ${siteConfig.email}`,
    `- إنستغرام: ${siteConfig.social.instagram}`,
    "",
    "## الصفحات",
    "",
    ...pages().map(
      (page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.note}`,
    ),
    "",
    `- [ملخص للوكلاء](${absoluteUrl("/llms.txt")})`,
    "",
  ];
  return lines.join("\n");
}

export function llmsText() {
  const phone = `+${siteConfig.phone}`;
  return [
    `# ${siteConfig.brand}`,
    "",
    `> ${siteConfig.name} (${siteConfig.nameEn}) يصمّم ويطوّر مواقع عربية للشركات في السعودية. التواصل مباشر عبر واتساب، والسعر يُتفق عليه قبل البدء.`,
    "",
    "Content-Signal: search=yes, ai-train=no",
    "",
    "## الهوية",
    "",
    `- الاسم: ${siteConfig.name}`,
    `- العلامة: ${siteConfig.brand}`,
    `- الموقع: ${siteConfig.url}`,
    `- الهاتف: ${phone}`,
    `- البريد: ${siteConfig.email}`,
    `- واتساب: ${siteConfig.social.whatsapp}`,
    `- إنستغرام: ${siteConfig.social.instagram}`,
    "",
    "## الصفحات الأساسية",
    "",
    ...pages().map(
      (page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.note}`,
    ),
    "",
    "## للوكلاء",
    "",
    `- [الصفحة الرئيسية بصيغة Markdown](${absoluteUrl("/index.md")})`,
    `- أرسل \`Accept: text/markdown\` إلى ${siteConfig.url} للحصول على نفس الملخص.`,
    `- بطاقة خادم MCP: ${absoluteUrl("/.well-known/mcp/server-card.json")}`,
    "",
  ].join("\n");
}

export function serverCard() {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: PROTOCOL_VERSION,
    serverInfo: {
      name: SERVER_NAME,
      title: siteConfig.brand,
      version: SERVER_VERSION,
    },
    description:
      "Read-only MCP server for WA STUDIO: business profile, key pages, and the public site summary.",
    iconUrl: absoluteUrl("/brand/logo-on-dark.png"),
    documentationUrl: absoluteUrl("/llms.txt"),
    transport: {
      type: "streamable-http",
      endpoint: absoluteUrl("/mcp"),
    },
    capabilities: {
      tools: {},
      resources: {},
    },
    tools: [
      {
        name: "get_business_profile",
        title: "Business profile",
        description: "Return the public identity, contact channels, and services of WA STUDIO.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
      },
      {
        name: "get_page",
        title: "Page summary",
        description: "Return the public URL and a one-line summary for a known site path.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Site path such as /about or /contact." },
          },
          required: ["path"],
          additionalProperties: false,
        },
      },
    ],
    resources: [
      {
        name: "llms_txt",
        title: "llms.txt",
        uri: absoluteUrl("/llms.txt"),
        description: "Agent summary of the site and its key pages.",
        mimeType: "text/plain",
      },
      {
        name: "homepage_markdown",
        title: "Homepage Markdown",
        uri: absoluteUrl("/index.md"),
        description: "Markdown representation of the homepage.",
        mimeType: "text/markdown",
      },
    ],
  };
}

export function mcpResult(method: string, params: Record<string, unknown> | undefined) {
  if (method === "initialize") {
    return {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: SERVER_NAME, title: siteConfig.brand, version: SERVER_VERSION },
      instructions: "Read-only. Use get_business_profile, get_page, or the listed resources.",
    };
  }

  if (method === "ping") return {};

  if (method === "tools/list") {
    return { tools: serverCard().tools };
  }

  if (method === "resources/list") {
    return { resources: serverCard().resources };
  }

  if (method === "tools/call") {
    const name = String(params?.name ?? "");
    const args = (params?.arguments ?? {}) as Record<string, unknown>;
    if (name === "get_business_profile") {
      return {
        content: [{ type: "text", text: homepageMarkdown() }],
      };
    }
    if (name === "get_page") {
      const path = String(args.path ?? "/");
      const normalized = path.startsWith("/") ? path : `/${path}`;
      const page = pages().find((item) => item.path === normalized);
      const text = page
        ? `${page.title}\n${absoluteUrl(page.path)}\n${page.note}`
        : `Unknown path: ${normalized}`;
      return { content: [{ type: "text", text }], isError: !page };
    }
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  if (method === "resources/read") {
    const uri = String(params?.uri ?? "");
    if (uri === absoluteUrl("/llms.txt")) {
      return {
        contents: [{ uri, mimeType: "text/plain", text: llmsText() }],
      };
    }
    if (uri === absoluteUrl("/index.md") || uri === absoluteUrl("/")) {
      return {
        contents: [
          { uri: absoluteUrl("/index.md"), mimeType: "text/markdown", text: homepageMarkdown() },
        ],
      };
    }
    return {
      contents: [{ uri, mimeType: "text/plain", text: `Unknown resource: ${uri}` }],
      isError: true,
    };
  }

  return undefined;
}
