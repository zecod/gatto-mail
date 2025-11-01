// At the top of your API file
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - entry.firstRequest > WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}
