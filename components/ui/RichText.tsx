import type { TextSegment, TextTone } from "@/content/ar";
import { cn } from "@/lib/cn";
import { Fragment } from "react";

const headingTones: Record<TextTone, string> = {
  light: "font-extralight text-brand-cream",
  strong: "font-extrabold text-brand-cream",
  accent: "font-extrabold text-brand-accent",
};

const bodyTones: Record<TextTone, string> = {
  light: "",
  strong: "font-bold text-brand-cream",
  accent: "font-bold text-brand-accent",
};

/** عنوان متعدد الأسطر، كل سطر مقاطع بنبرات مختلفة (خفيف / عريض / تأكيد) */
export function HeadingLines({
  lines,
  lineClassName,
}: {
  lines: readonly (readonly TextSegment[])[];
  lineClassName?: string;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassName)}>
          {line.map((segment, j) => (
            <Fragment key={j}>
              {j > 0 ? " " : null}
              <span className={headingTones[segment.tone ?? "light"]}>
                {segment.text}
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </>
  );
}

/** فقرة تحتوي عبارات مميّزة بخط عريض */
export function BodyText({ segments }: { segments: readonly TextSegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.tone && segment.tone !== "light" ? (
          <strong key={i} className={bodyTones[segment.tone]}>
            {segment.text}
          </strong>
        ) : (
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}
