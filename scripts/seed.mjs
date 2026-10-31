import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL is not defined in environment or .env file.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl });

async function seed() {
  try {
    await client.connect();
    console.log("✓ Connected to PostgreSQL database.");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const sqlPath = path.resolve(__dirname, "../seed.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");
    console.log("✓ Running seed.sql...");
    await client.query(sql);
    console.log("✓ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
