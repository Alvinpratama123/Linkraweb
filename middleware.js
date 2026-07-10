import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestBuckets = new Map();

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function applyRateLimit(request) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/auth/")) {
    return null;
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = requestBuckets.get(ip) || [];
  const recentEntries = bucket.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  recentEntries.push(now);
  requestBuckets.set(ip, recentEntries);

  if (recentEntries.length > RATE_LIMIT_MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Terlalu banyak percobaan, coba lagi nanti",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "900",
        },
      }
    );
  }

  return null;
}

export function middleware(request) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
