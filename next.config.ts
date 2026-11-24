import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // mysql2 يُحمَّل من node_modules وقت التشغيل بدل تجميعه داخل الخادم.
  serverExternalPackages: ["mysql2"],
  experimental: {
    // صورة المشروع تُرفع مع النموذج بعد ضغطها في المتصفح.
    serverActions: { bodySizeLimit: "2mb" },
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
