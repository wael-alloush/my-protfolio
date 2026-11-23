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
          className="font-medium text-brand-accent underline-offset-4 hover:underline"
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
        className="font-medium text-brand-accent underline-offset-4 hover:underline"
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
    <div className="prose-brand space-y-5 text-brand-cream">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n").map((line) => line.trim());

        if (lines.length === 1 && trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl font-extrabold text-brand-accent"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (lines.length === 1 && trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 text-xl font-extrabold text-brand-cream">
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-2 text-brand-muted">
              {lines.map((line) => (
                <li key={line} className="flex gap-2 leading-8">
                  <span className="text-brand-accent" aria-hidden>
                    •
                  </span>
                  <span>{inline(line.replace(/^- /, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+[.)]\s/.test(line))) {
          return (
            <ol key={index} className="space-y-2 text-brand-muted">
              {lines.map((line, lineIndex) => (
                <li key={line} className="flex gap-2 leading-8">
                  <span className="font-medium text-brand-accent">
                    {lineIndex + 1}.
                  </span>
                  <span>{inline(line.replace(/^\d+[.)]\s+/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (isTable(lines)) {
          const rows = lines
            .filter((line) => !/^\|?\s*-+/.test(line.replace(/\|/g, "").trim()) && !/^[\s|:-]+$/.test(line))
            .map((line) =>
              line
                .replace(/^\|/, "")
                .replace(/\|$/, "")
                .split("|")
                .map((cell) => cell.trim()),
            );
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-brand-muted">
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={row.join("-")} className="border-b border-brand-border">
                      {row.map((cell) => {
                        const Cell = rowIndex === 0 ? "th" : "td";
                        return (
                          <Cell
                            key={cell}
                            className={cn(
                              "px-3 py-2 text-start align-top",
                              rowIndex === 0 && "font-medium text-brand-cream",
                            )}
                          >
                            {inline(cell)}
                          </Cell>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={index} className={cn("leading-8 text-brand-muted")}>
            {inline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
