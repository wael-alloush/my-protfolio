import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const COOKIE = "wa_admin";
const COOKIE_PATH = "/admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const failedLogins = new Map<string, { count: number; resetAt: number }>();

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** اللوحة مقفلة تماماً ما لم تُضبط كلمة مرور بطول كافٍ. */
export function isAdminConfigured() {
  return adminPassword().length >= MIN_PASSWORD_LENGTH;
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/** مقارنة بزمن ثابت حتى لا يكشف زمن الرد عن جزء من القيمة. */
function same(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

// مفتاح التوقيع مشتق من كلمة المرور: تغييرها يُنهي كل الجلسات السابقة.
function signature(expires: number) {
  return createHmac("sha256", digest(`wa-admin-session:${adminPassword()}`))
    .update(String(expires))
    .digest("hex");
}

export function passwordMatches(candidate: string) {
  return isAdminConfigured() && same(candidate, adminPassword());
}

async function setCookie(value: string, expires: Date) {
  const store = await cookies();
  store.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    expires,
  });
}

export async function startSession() {
  const expires = Date.now() + SESSION_MS;
  await setCookie(`${expires}.${signature(expires)}`, new Date(expires));
}

export async function endSession() {
  await setCookie("", new Date(0));
}

export const isAdmin = cache(async () => {
  if (!isAdminConfigured()) return false;

  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const [expiresText, signed] = value.split(".");
  const expires = Number(expiresText);
  if (!signed || !Number.isFinite(expires) || expires < Date.now()) return false;

  return same(signed, signature(expires));
});

/** يُستدعى في كل صفحة وكل إجراء داخل اللوحة، لا في التخطيط فقط. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

async function clientKey() {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function loginAllowed() {
  const entry = failedLogins.get(await clientKey());
  return !entry || entry.resetAt < Date.now() || entry.count < MAX_FAILED_LOGINS;
}

export async function recordFailedLogin() {
  const key = await clientKey();
  const now = Date.now();
  const entry = failedLogins.get(key);
  if (!entry || entry.resetAt < now) {
    failedLogins.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}
