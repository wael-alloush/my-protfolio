export type ContentHeading = { level: 2 | 3; text: string };

/** يستخرج ## و ### من نص المقال بنفس قواعد العارض. */
export function parseMarkdownHeadings(content: string): ContentHeading[] {
  const headings: ContentHeading[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4).trim();
      if (text) headings.push({ level: 3, text });
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      if (text) headings.push({ level: 2, text });
    }
  }
  return headings;
}

/** عناوين أقسام الخدمة/المشروع تُعرض كـ H2 في الصفحة. */
export function headingsFromTitles(titles: string[]): ContentHeading[] {
  return titles
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ level: 2 as const, text }));
}
