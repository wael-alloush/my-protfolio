import { contactSchema } from "@/lib/validations/contact";
import { siteConfig } from "@/lib/site";
import { NextResponse } from "next/server";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "too_many_requests" },
        { status: 429 },
      );
    }

    const body: unknown = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (siteConfig.contactMode === "resend") {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { ok: false, error: "resend_not_configured" },
          { status: 500 },
        );
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
          to: [siteConfig.email],
          subject: `طلب تصميم موقع جديد — ${data.name}`,
          text: [
            `الاسم: ${data.name}`,
            `الجوال: ${data.phone}`,
            `البريد: ${data.email}`,
            `نوع الموقع: ${data.siteType}`,
            "",
            data.message,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: "email_failed" },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, mode: "resend" });
    }

    const text = [
      `مرحباً ${siteConfig.name}، أرغب في طلب تصميم موقع:`,
      `الاسم: ${data.name}`,
      `الجوال: ${data.phone}`,
      `البريد: ${data.email}`,
      `نوع الموقع: ${data.siteType}`,
      `نبذة: ${data.message}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(text)}`;

    return NextResponse.json({
      ok: true,
      mode: "whatsapp",
      whatsappUrl,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
