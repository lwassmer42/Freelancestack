// Simple in-memory IP rate limiter using a Map.
// Note: each Worker isolate has its own memory, so this is per-isolate.
// For production, use Durable Objects or KV for cross-isolate rate limiting.

const store = new Map(); // key -> { count, resetAt }

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Cleanup stale entries periodically to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);
