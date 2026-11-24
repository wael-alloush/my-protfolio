import { db, isDbConfigured, nowUtc } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

/** يوحّد المسار إلى شكل يبدأ بشرطة مائلة وبدون شرطة في النهاية (ما عدا الجذر). */
export function normalizePath(path: string) {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

/**
 * يسجّل تحويلاً دائماً من مسار قديم إلى مسار جديد، ويحدّث السلسلة
 * حتى لا تبقى تحويلات تشير إلى مسار لم يعد موجوداً.
 */
export async function recordRedirect(fromPath: string, toPath: string) {
  const from = normalizePath(fromPath);
  const to = normalizePath(toPath);
  if (from === "/" || to === "/" || from === to) return;

  const pool = await db();
  // الوجهة الجديدة لا يجب أن تُحوَّل بعيداً عن نفسها.
  await pool.query("DELETE FROM wa_redirects WHERE from_path = ?", [to]);
  // أي تحويل كان يشير إلى المسار القديم يشير الآن إلى الوجهة الجديدة.
  await pool.query("UPDATE wa_redirects SET to_path = ? WHERE to_path = ?", [to, from]);
  await pool.query(
    `INSERT INTO wa_redirects (from_path, to_path, created_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE to_path = VALUES(to_path), created_at = VALUES(created_at)`,
    [from, to, nowUtc()],
  );
}

/** يبحث عن وجهة التحويل إن وُجدت؛ بدون قاعدة بيانات أو عند الخطأ يعيد null. */
export async function resolveRedirect(pathname: string) {
  if (!isDbConfigured()) return null;

  const start = normalizePath(pathname);
  if (start === "/") return null;

  try {
    const pool = await db();
    let current = start;
    for (let i = 0; i < 5; i += 1) {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT to_path FROM wa_redirects WHERE from_path = ? LIMIT 1",
        [current],
      );
      const next = rows[0]?.to_path;
      if (typeof next !== "string" || !next) {
        return current === start ? null : current;
      }
      const normalized = normalizePath(next);
      if (normalized === current) return null;
      current = normalized;
    }
    return current === start ? null : current;
  } catch (error) {
    console.error(error);
    return null;
  }
}
