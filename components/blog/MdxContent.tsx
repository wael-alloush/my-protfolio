import { siteConfig } from "@/lib/site";
import Link from "next/link";
import type { ReactNode } from "react";

const LINK_PATTERN = "\\[[^\\]]+\\]\\([^)\\s]+\\)";

function parseLinkToken(token: string) {
  const match = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
  return match ? { label: match[1], href: match[2] } : null;
}

function findMarkdownLinks(line: string) {
  return line.match(new RegExp(LINK_PATTERN, "g"));
}

/** روابط الموقع الكامل تُحوَّل لمسار داخلي حتى يعمل التنقل داخل التطبيق. */
function normalizeHref(href: string) {
  const base = siteConfig.url.replace(/\/$/, "");
  if (href === base || href === `${base}/`) return "/";
  if (href.startsWith(`${base}/`)) return href.slice(base.length) || "/";
  return href;
}

function MdLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const target = normalizeHref(href);
  const className =
    "font-medium text-brand-accent underline decoration-brand-accent/30 underline-offset-[6px] transition duration-brand hover:decoration-brand-accent";

  if (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("tel:")) {
    return (
      <a href={target} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}

/** روابط وتنسيق سطري بسيط (**غامق** و*مائل*) داخل الفقرات والعناوين. */
function inline(text: string): ReactNode[] {
  const tokens = text.split(
    new RegExp(`(${LINK_PATTERN}|\\*\\*[^*]+\\*\\*|\\*[^*]+\\*)`, "g"),
  );

  return tokens.map((token, index) => {
    const link = parseLinkToken(token);
    if (link) {
      return (
        <MdLink key={index} href={link.href}>
          {link.label}
        </MdLink>
      );
    }

    const bold = token.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={index} className="font-bold text-brand-cream">
          {bold[1]}
        </strong>
      );
    }

    const italic = token.match(/^\*([^*]+)\*$/);
    if (italic) {
      return (
        <em key={index} className="italic">
          {italic[1]}
        </em>
      );
    }

    return token ? <span key={index}>{token}</span> : null;
  });
}

type MdLinkItem = { label: string; href: string };

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "links"; items: MdLinkItem[] }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; rows: string[][] };

function isTableSeparator(line: string) {
  const cells = line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

/** سطر تنقل: رابطان أو أكثر مفصولان بـ | أو رموز فاصلة — ليس جدولاً. */
function parseLinkRow(line: string): MdLinkItem[] | null {
  const matches = findMarkdownLinks(line);
  if (!matches || matches.length < 2) return null;
  const rest = line.replace(new RegExp(LINK_PATTERN, "g"), "").trim();
  if (rest && !/^[\s|·•\/،,–—-]+$/.test(rest)) return null;
  return matches
    .map(parseLinkToken)
    .filter((item): item is MdLinkItem => item !== null);
}

function parseTable(lines: string[]): string[][] {
  return lines
    .filter((line) => !isTableSeparator(line))
    .map((line) =>
      line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((row) => row.some((cell) => cell.length > 0));
}

/** يحوّل نص المدونة إلى كتل منظمة بدل الاعتماد على فواصل الأسطر الفارغة فقط. */
export function parseMarkdownBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").trim().split("\n");
  const blocks: Block[] = [];
  let i = 0;

  function flushParagraph(buffer: string[]) {
    const text = buffer.join(" ").trim();
    buffer.length = 0;
    if (!text) return;
    const linkRow = parseLinkRow(text);
    if (linkRow) {
      blocks.push({ type: "links", items: linkRow });
      return;
    }
    blocks.push({ type: "p", text });
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }

    const linkRow = parseLinkRow(line);
    if (linkRow) {
      blocks.push({ type: "links", items: linkRow });
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length) {
        const item = lines[i].trim();
        if (!item) {
          const next = lines[i + 1]?.trim() ?? "";
          if (next.startsWith("- ")) {
            i += 1;
            continue;
          }
          break;
        }
        if (!item.startsWith("- ")) break;
        items.push(item.slice(2).trim());
        i += 1;
      }
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        const item = lines[i].trim();
        if (!item) {
          const next = lines[i + 1]?.trim() ?? "";
          if (/^\d+[.)]\s+/.test(next)) {
            i += 1;
            continue;
          }
          break;
        }
        if (!/^\d+[.)]\s+/.test(item)) break;
        items.push(item.replace(/^\d+[.)]\s+/, "").trim());
        i += 1;
      }
      if (items.length) blocks.push({ type: "ol", items });
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1].trim()) &&
      !parseLinkRow(line)
    ) {
      const tableLines: string[] = [];
      while (i < lines.length) {
        const row = lines[i].trim();
        if (!row || !row.includes("|") || parseLinkRow(row)) break;
        tableLines.push(row);
        i += 1;
      }
      const rows = parseTable(tableLines);
      if (rows.length) blocks.push({ type: "table", rows });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next) break;
      if (next.startsWith("## ") || next.startsWith("### ")) break;
      if (next.startsWith("- ") || /^\d+[.)]\s+/.test(next)) break;
      if (parseLinkRow(next)) break;
      if (
        next.includes("|") &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1].trim())
      ) {
        break;
      }
      paragraph.push(next);
      i += 1;
    }
    flushParagraph(paragraph);
  }

  return blocks;
}

export function MdxContent({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="prose-brand space-y-6 text-[1.0625rem] leading-[1.95] sm:space-y-7 sm:text-[1.125rem] sm:leading-[2]">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="scroll-mt-28 pt-8 text-h3 text-brand-cream sm:pt-10 sm:text-[1.5rem]"
            >
              {inline(block.text)}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="scroll-mt-28 pt-4 text-[1.125rem] font-bold leading-8 text-brand-cream sm:text-[1.25rem]"
            >
              {inline(block.text)}
            </h3>
          );
        }

        if (block.type === "links") {
          return (
            <p
              key={index}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-brand-text-soft"
            >
              {block.items.map((item, itemIndex) => (
                <span key={`${item.href}-${itemIndex}`} className="inline-flex items-center gap-3">
                  {itemIndex > 0 ? (
                    <span className="text-brand-muted" aria-hidden>
                      |
                    </span>
                  ) : null}
                  <MdLink href={item.href}>{item.label}</MdLink>
                </span>
              ))}
            </p>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="space-y-3.5 text-brand-text-soft">
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`} className="flex gap-3.5">
                  <span
                    className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary"
                    aria-hidden
                  />
                  <span className="font-light">{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index} className="space-y-3.5 text-brand-text-soft">
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`} className="flex gap-3.5">
                  <span className="mt-0.5 w-7 shrink-0 text-sm font-bold text-brand-secondary tabular-nums">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-light">{inline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "table") {
          const [header, ...body] = block.rows;
          return (
            <div
              key={index}
              className="overflow-x-auto rounded-brand-lg border border-brand-border/70 bg-brand-surface/80"
            >
              <table className="w-full min-w-[28rem] border-collapse text-sm sm:text-[0.9375rem]">
                {header ? (
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card/50">
                      {header.map((cell, cellIndex) => (
                        <th
                          key={`${cellIndex}-${cell}`}
                          className="px-4 py-3.5 text-start align-top text-sm font-bold leading-7 text-brand-cream"
                        >
                          {inline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {body.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-brand-border/60 last:border-b-0"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cellIndex}-${cell}`}
                          className="px-4 py-3.5 text-start align-top font-light leading-7 text-brand-cream/78"
                        >
                          {inline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "p") {
          return (
            <p key={index} className="text-brand-text-soft">
              {inline(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
