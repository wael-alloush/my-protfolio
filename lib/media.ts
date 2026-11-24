import { db, isDbConfigured, nowUtc } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

/** أصغر من حد الحزمة الافتراضي في MySQL (1MB) مع هامش لبقية الاستعلام. */
export const MAX_IMAGE_BYTES = 900_000;

type ImageKind = { mime: string; extension: string };

/** يُحدَّد النوع من محتوى الملف نفسه، لا من الاسم أو النوع الذي يرسله المتصفح. */
export function detectImage(data: Buffer): ImageKind | null {
  if (data.length < 12) return null;
  if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: "image/png", extension: "png" };
  }
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg" };
  }
  if (
    data.subarray(0, 4).toString("ascii") === "RIFF" &&
    data.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mime: "image/webp", extension: "webp" };
  }
  return null;
}

function mediaId(path: string) {
  const match = path.match(/^\/media\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

/** يحفظ الصورة ويعيد مسارها العام، مثل ‎/media/12/project-name.webp */
export async function addMedia(name: string, kind: ImageKind, data: Buffer) {
  const filename = `${name}.${kind.extension}`;
  const pool = await db();
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO wa_media (filename, mime, data, created_at) VALUES (?, ?, ?, ?)",
    [filename, kind.mime, data, nowUtc()],
  );
  return `/media/${result.insertId}/${filename}`;
}

/** صور المشاريع الأصلية ملفات داخل المشروع؛ يُحذف فقط ما رُفع من اللوحة. */
export async function removeMedia(path: string) {
  const id = mediaId(path);
  if (id === null) return;
  const pool = await db();
  await pool.query("DELETE FROM wa_media WHERE id = ?", [id]);
}

export async function readMedia(id: number) {
  if (!isDbConfigured()) return null;
  const pool = await db();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT mime, data FROM wa_media WHERE id = ?",
    [id],
  );
  const row = rows[0];
  if (!row) return null;
  return { mime: String(row.mime), data: row.data as Buffer };
}
