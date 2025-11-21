import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Connect to Upstash Redis (REST API)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Allow each IP 3 requests per minute (strict)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "1 m"),
});

// THE REQUIRED "proxy" FUNCTION
export default async function proxy(request: Request) {
  const url = new URL(request.url);

  // Only protect /api/generate route
  if (!url.pathname.startsWith("/api/generate")) {
    return; // allow request
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // allow request to continue
  return;
}
