import postgres from "postgres";
import type { ContactInput } from "./validators";

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export async function saveContact(input: ContactInput & { id: string }) {
  const db = getSql();
  if (!db) return { stored: false as const };
  await db`
    INSERT INTO site_contact (id, name, email, topic, message)
    VALUES (
      ${input.id},
      ${input.name},
      ${input.email},
      ${input.topic},
      ${input.message}
    )
  `;
  return { stored: true as const };
}

export function contactTopicLabel(topic: ContactInput["topic"]) {
  if (topic === "privacy") return "Privacy or data request";
  if (topic === "partnership") return "Partnership or media";
  if (topic === "other") return "Something else";
  return "General question";
}
