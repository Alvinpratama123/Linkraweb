const requestBuckets = new Map();

export function rateLimiter(maxRequests, windowMs) {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
      || req.headers["x-real-ip"]
      || req.ip
      || "unknown";

    const now = Date.now();
    const bucket = requestBuckets.get(ip) || [];
    const recent = bucket.filter(t => now - t < windowMs);

    recent.push(now);
    requestBuckets.set(ip, recent);

    if (recent.length > maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Terlalu banyak percobaan, coba lagi nanti",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    next();
  };
}
