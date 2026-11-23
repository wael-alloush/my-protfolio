import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-medium text-brand-accent">404</p>
      <h1 className="mt-3 text-title text-brand-cream">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-brand-muted">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Button href="/" variant="primary" className="mt-8">
        العودة للرئيسية
      </Button>
    </Container>
  );
}
