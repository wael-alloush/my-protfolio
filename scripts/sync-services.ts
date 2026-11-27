import { readFileSync } from "fs";
import mysql from "mysql2/promise";
import { syncFileServices } from "../lib/seed";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

async function main() {
  const pool = mysql.createPool({
    host: env.DB_HOST || "127.0.0.1",
    port: Number(env.DB_PORT || 3306),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD || "",
  });
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const connection = await pool.getConnection();
  try {
    await syncFileServices(connection, now);
    const [rows] = await connection.query(
      "SELECT slug, title, card_title FROM wa_services ORDER BY sort_order",
    );
    console.log(rows);
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
