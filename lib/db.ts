import { seedContent } from "@/lib/seed";
import mysql from "mysql2/promise";
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DbConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

function readConfig(): DbConfig | null {
  const host = process.env.DB_HOST?.trim();
  const database = process.env.DB_NAME?.trim();
  const user = process.env.DB_USER?.trim();
  if (!host || !database || !user) return null;

  const port = Number(process.env.DB_PORT ?? 3306);
  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 3306,
    database,
    user,
    password: process.env.DB_PASSWORD ?? "",
  };
}

/** بدون بيانات الاتصال يعمل الموقع من ملفات المحتوى ولا تعمل لوحة التحكم. */
export function isDbConfigured() {
  return readConfig() !== null;
}

/** وقت UTC بصيغة DATETIME، حتى لا يعتمد على المنطقة الزمنية للخادم. */
export function nowUtc() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

// يبقى الاتصال واحداً عبر إعادة التحميل في وضع التطوير.
const globalForDb = globalThis as unknown as {
  waPool?: Pool;
  waReady?: Promise<void>;
};

const TABLE_OPTIONS = "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS wa_settings (
    name VARCHAR(64) NOT NULL PRIMARY KEY,
    value TEXT NOT NULL
  ) ${TABLE_OPTIONS}`,
  `CREATE TABLE IF NOT EXISTS wa_posts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(120) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    published_on DATE NOT NULL,
    status VARCHAR(16) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY wa_posts_slug (slug)
  ) ${TABLE_OPTIONS}`,
  `CREATE TABLE IF NOT EXISTS wa_services (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    card_title VARCHAR(255) NOT NULL,
    card_description TEXT NOT NULL,
    intro TEXT NOT NULL,
    points TEXT NOT NULL,
    sections MEDIUMTEXT NOT NULL,
    sort_order INT NOT NULL,
    status VARCHAR(16) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY wa_services_slug (slug)
  ) ${TABLE_OPTIONS}`,
  `CREATE TABLE IF NOT EXISTS wa_projects (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(120) NOT NULL,
    summary TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    points TEXT NOT NULL,
    sections MEDIUMTEXT NOT NULL,
    featured TINYINT(1) NOT NULL,
    sort_order INT NOT NULL,
    status VARCHAR(16) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY wa_projects_slug (slug)
  ) ${TABLE_OPTIONS}`,
  `CREATE TABLE IF NOT EXISTS wa_media (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(190) NOT NULL,
    mime VARCHAR(60) NOT NULL,
    data MEDIUMBLOB NOT NULL,
    created_at DATETIME NOT NULL
  ) ${TABLE_OPTIONS}`,
  `CREATE TABLE IF NOT EXISTS wa_redirects (
    from_path VARCHAR(255) NOT NULL PRIMARY KEY,
    to_path VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    KEY wa_redirects_to (to_path)
  ) ${TABLE_OPTIONS}`,
];

/** يضيف عموداً إن كان الجدول قديماً بلا هذا الحقل. */
async function ensureColumn(
  pool: Pool,
  table: string,
  column: string,
  definition: string,
) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 1 AS ok FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
     LIMIT 1`,
    [table, column],
  );
  if (rows.length === 0) {
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
}

/** ينشئ الجداول، وينقل محتوى الملفات الحالي إليها مرة واحدة فقط. */
async function migrate(pool: Pool) {
  for (const statement of SCHEMA) {
    await pool.query(statement);
  }

  // قواعد موجودة قبل دعم عناوين H2 للمشاريع.
  await ensureColumn(pool, "wa_projects", "sections", "MEDIUMTEXT NULL");
  await pool.query(
    "UPDATE wa_projects SET sections = '[]' WHERE sections IS NULL OR sections = ''",
  );

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // السطر يُحجز داخل المعاملة، فلا تنقل عمليتان متزامنتان المحتوى مرتين.
    const [claim] = await connection.query<ResultSetHeader>(
      "INSERT IGNORE INTO wa_settings (name, value) VALUES ('seeded_at', ?)",
      [nowUtc()],
    );
    if (claim.affectedRows === 1) {
      await seedContent(connection, nowUtc());
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * سبب تعذّر استخدام القاعدة كما تعرضه لوحة التحكم، أو null إذا كانت تعمل.
 * code هو رمز الخطأ من MySQL أو من الشبكة، مثل ER_ACCESS_DENIED_ERROR.
 */
export async function dbProblem(): Promise<{ configured: boolean; code: string } | null> {
  if (!isDbConfigured()) return { configured: false, code: "" };
  try {
    await db();
    return null;
  } catch (error) {
    console.error(error);
    return { configured: true, code: String((error as { code?: string }).code ?? "UNKNOWN") };
  }
}

export async function db(): Promise<Pool> {
  const config = readConfig();
  if (!config) throw new Error("Database is not configured");

  if (!globalForDb.waPool) {
    globalForDb.waPool = mysql.createPool({
      ...config,
      charset: "utf8mb4",
      connectionLimit: 5,
      dateStrings: true,
      waitForConnections: true,
    });
  }

  if (!globalForDb.waReady) {
    globalForDb.waReady = migrate(globalForDb.waPool).catch((error) => {
      globalForDb.waReady = undefined;
      throw error;
    });
  }
  await globalForDb.waReady;

  return globalForDb.waPool;
}
