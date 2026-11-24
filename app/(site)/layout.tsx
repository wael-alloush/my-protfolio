import { SiteShell } from "@/components/layout/SiteShell";
import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
