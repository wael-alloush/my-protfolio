import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  children,
  className,
  id,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("section-space", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
