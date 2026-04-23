type RateLimitStore = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitStore>();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count += 1;
  store.set(identifier, record);
  return { success: true };
}
