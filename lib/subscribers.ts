import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export async function saveSubscriber(input: { id: string; email: string; name?: string; source?: string }) {
  const db = getSql();
  if (!db) return { stored: false as const };
  await db`
    INSERT INTO catalog_subscribers (id, email, name, source)
    VALUES (${input.id}, ${input.email}, ${input.name ?? null}, ${input.source ?? "submit_form"})
    ON CONFLICT (email) DO NOTHING
  `;
  return { stored: true as const };
}

export async function listSubscribers(limit = 300) {
  const db = getSql();
  if (!db) return [] as Array<{ email: string; name: string | null }>;
  const safeLimit = Math.min(Math.max(limit, 1), 2000);
  const rows = await db<Array<{ email: string; name: string | null }>>`
    SELECT email, name
    FROM catalog_subscribers
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
  return rows;
}
