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

export async function setPendingQueueJsonStatus(input: {
  id?: string;
  slug?: string;
  queueStatus: QueueSubmissionItem["queueStatus"];
}) {
  if (!hasUpstash()) return { stored: false as const, changed: false as const };

  const id = input.id?.trim();
  const slug = input.slug?.trim();
  if (!id && !slug) return { stored: false as const, changed: false as const };

  const existing = await readPendingQueueJson();
  let changed = false;
  const next = existing.map((item) => {
    const match = (id && item.id === id) || (slug && item.slug === slug);
    if (!match || item.queueStatus === input.queueStatus) return item;
    changed = true;
    return { ...item, queueStatus: input.queueStatus };
  });

  if (!changed) return { stored: true as const, changed: false as const };
  const result = await upstashCommand(["SET", PENDING_QUEUE_KEY, JSON.stringify(next)]);
  return { stored: result === "OK", changed: true as const };
}

export async function removePendingQueueJsonEntries(input: { id?: string; slug?: string }) {
  if (!hasUpstash()) return { stored: false as const, removed: 0 };

  const id = input.id?.trim();
  const slug = input.slug?.trim();
  if (!id && !slug) return { stored: false as const, removed: 0 };

  const existing = await readPendingQueueJson();
  const next = existing.filter((item) => {
    const byId = id ? item.id === id : false;
    const bySlug = slug ? item.slug === slug : false;
    return !byId && !bySlug;
  });

  const removed = existing.length - next.length;
  if (removed <= 0) return { stored: true as const, removed: 0 };

  const result = await upstashCommand(["SET", PENDING_QUEUE_KEY, JSON.stringify(next)]);
  return { stored: result === "OK", removed };
}
