import type { QueueSubmissionItem } from "@/lib/submissions-shared";

const PENDING_QUEUE_KEY = "pending-queue:json";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim();
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

function hasUpstash() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

async function upstashCommand(command: unknown[]) {
  if (!hasUpstash()) return null;
  try {
    const response = await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { result?: unknown };
    return json.result ?? null;
  } catch {
    return null;
  }
}

export function isPendingJsonConfigured() {
  return hasUpstash();
}

export async function readPendingQueueJson(): Promise<QueueSubmissionItem[]> {
  const raw = await upstashCommand(["GET", PENDING_QUEUE_KEY]);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw) as QueueSubmissionItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      queueStatus: item?.queueStatus ?? "awaiting_review",
    }));
  } catch {
    return [];
  }
}

export async function upsertPendingQueueJson(item: QueueSubmissionItem) {
  if (!hasUpstash()) return { stored: false as const };

  const existing = await readPendingQueueJson();
  const next = [item, ...existing.filter((row) => row.slug !== item.slug && row.id !== item.id)].slice(
    0,
    200,
  );
  const result = await upstashCommand(["SET", PENDING_QUEUE_KEY, JSON.stringify(next)]);
  return { stored: result === "OK" };
}
