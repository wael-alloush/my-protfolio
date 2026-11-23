/**
 * Design Tokens — مرجع مكتوب بـ TypeScript لهوية WA STUDIO.
 *
 * ملاحظة: المشروع يعمل بـ Tailwind v4 (CSS-first)، لذلك التوكنز الفعّالة تُقرأ من
 * `app/globals.css` (`:root` + `@theme`). هذا الملف يوثّق نفس القيم لاستخدامها في
 * الكود (مثل صور OG) ويجب تحديثه مع globals.css عند تغيير الهوية.
 */
export const brandTokens = {
  colors: {
    primary: "#0D3B34",
    secondary: "#2F6B5C",
    accent: "#E3B341",
    cream: "#F7F6F2",
    sand: "#EDE6D6",
    dark: "#1A1D1F",
  },
  fonts: {
    sans: "Tajawal",
  },
  radius: {
    sm: "0.75rem",
    md: "1.25rem",
    lg: "1.875rem",
    xl: "2.1875rem",
    "2xl": "3.125rem",
    pill: "9999px",
  },
  container: "78rem",
  duration: "250ms",
} as const;

export type BrandTokens = typeof brandTokens;
