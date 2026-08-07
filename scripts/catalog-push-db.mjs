import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";
import { loadScriptEnv } from "./load-env.mjs";

await loadScriptEnv();

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl || dbUrl.includes("replace") || dbUrl.includes("user:password")) {
  console.error("DATABASE_URL is missing or placeholder. Aborting push.");
  process.exit(1);
}

const root = process.cwd();
const catalogPath = resolve(root, "data", "companies.json");

function assertCatalogShape(value) {
  if (!value || typeof value !== "object") throw new Error("Catalog payload must be an object.");
  if (!Array.isArray(value.companies)) throw new Error("Catalog payload requires companies[] array.");
  if (typeof value.dataYear !== "string" && typeof value.dataYear !== "number") {
    throw new Error("Catalog payload requires dataYear.");
  }
}

const raw = await readFile(catalogPath, "utf8");
const payload = JSON.parse(raw);
assertCatalogShape(payload);

const sql = postgres(dbUrl, { max: 1, prepare: false });

try {
  await sql.begin(async (tx) => {
    await tx`
      CREATE TABLE IF NOT EXISTS company_catalog_snapshots (
        id BIGSERIAL PRIMARY KEY,
        version TEXT NOT NULL,
        payload JSONB NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await tx`
      CREATE INDEX IF NOT EXISTS company_catalog_snapshots_active_idx
      ON company_catalog_snapshots (is_active)
      WHERE is_active = TRUE
    `;

    await tx`
      CREATE INDEX IF NOT EXISTS company_catalog_snapshots_created_at_idx
      ON company_catalog_snapshots (created_at DESC)
    `;

    const version = `${new Date().toISOString()}-catalog`;

    await tx`UPDATE company_catalog_snapshots SET is_active = FALSE WHERE is_active = TRUE`;

    await tx`
      INSERT INTO company_catalog_snapshots (version, payload, is_active, notes)
      VALUES (${version}, ${tx.json(payload)}, TRUE, ${"Synced from data/companies.json"})
    `;
  });

  console.log("Catalog push complete. Active snapshot updated.");
} finally {
  await sql.end({ timeout: 5 });
}
