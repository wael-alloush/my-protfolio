import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    if (href.startsWith("http")) {
      return (
        <a
          key={index}
          href={href}
          className="font-medium text-brand-accent underline decoration-brand-accent/30 underline-offset-[6px] transition duration-brand hover:decoration-brand-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        key={index}
        href={href}
        className="font-medium text-brand-accent underline decoration-brand-accent/30 underline-offset-[6px] transition duration-brand hover:decoration-brand-accent"
      >
        {label}
      </Link>
    );
  });
}

function isTable(lines: string[]) {
  return lines.length > 1 && lines.every((line) => line.includes("|"));
}

export function MdxContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="prose-brand space-y-6 text-[1.0625rem] leading-[1.95] sm:space-y-7 sm:text-[1.125rem] sm:leading-[2]">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n").map((line) => line.trim());

        if (lines.length === 1 && trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="scroll-mt-28 pt-8 text-h3 text-brand-cream sm:pt-10 sm:text-[1.5rem]"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (lines.length === 1 && trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="scroll-mt-28 pt-4 text-[1.125rem] font-bold leading-8 text-brand-cream sm:text-[1.25rem]"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-3.5 text-brand-text-soft">
              {lines.map((line) => (
                <li key={line} className="flex gap-3.5">
                  <span
                    className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary"
                    aria-hidden
                  />
                  <span className="font-light">{inline(line.replace(/^- /, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+[.)]\s/.test(line))) {
          return (
            <ol key={index} className="space-y-3.5 text-brand-text-soft">
              {lines.map((line, lineIndex) => (
                <li key={line} className="flex gap-3.5">
                  <span className="mt-0.5 w-7 shrink-0 text-sm font-bold text-brand-secondary tabular-nums">
                    {String(lineIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-light">{inline(line.replace(/^\d+[.)]\s+/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (isTable(lines)) {
          const rows = lines
            .filter(
              (line) =>
                !/^\|?\s*-+/.test(line.replace(/\|/g, "").trim()) &&
                !/^[\s|:-]+$/.test(line),
            )
            .map((line) =>
              line
                .replace(/^\|/, "")
                .replace(/\|$/, "")
                .split("|")
                .map((cell) => cell.trim()),
            );
          const [header, ...body] = rows;
          return (
            <div
              key={index}
              className="overflow-x-auto rounded-brand-lg border border-brand-border/70 bg-brand-surface/80"
            >
              <table className="w-full min-w-[28rem] border-collapse text-sm sm:text-[0.9375rem]">
                {header ? (
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card/50">
                      {header.map((cell) => (
                        <th
                          key={cell}
                          className="px-4 py-3.5 text-start align-top text-sm font-bold leading-7 text-brand-cream"
                        >
                          {inline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {body.map((row) => (
                    <tr
                      key={row.join("-")}
                      className="border-b border-brand-border/60 last:border-b-0"
                    >
                      {row.map((cell) => (
                        <td
                          key={cell}
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

        return (
          <p key={index} className="text-brand-text-soft">
            {inline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
