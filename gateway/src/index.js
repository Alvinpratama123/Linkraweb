import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { jwtVerifier } from "./middleware/jwtVerifier.js";
import { logger } from "./middleware/logger.js";
import { config } from "./config.js";
import http from "http";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: process.env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(logger);

app.use("/api/auth/login", rateLimiter(20, 15 * 60 * 1000));
app.use("/api/auth/register", rateLimiter(20, 15 * 60 * 1000));

function forwardToService(targetUrl, req, res, modifyResponse) {
  const url = new URL(targetUrl);
  const path = url.pathname + (url.search || "");
  const body = JSON.stringify(req.body);

  const options = {
    hostname: url.hostname,
    port: url.port,
    path,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = "";
    proxyRes.on("data", (chunk) => { data += chunk; });
    proxyRes.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        modifyResponse(parsed, res);
      } catch {
        res.status(proxyRes.statusCode).set(proxyRes.headers).send(data);
      }
    });
  });

  proxyReq.on("error", (err) => {
    res.status(502).json({ success: false, message: "Service unavailable" });
  });

  proxyReq.write(body);
  proxyReq.end();
}

const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

app.post("/api/auth/login", (req, res) => {
  forwardToService(`${config.authServiceUrl}/auth/login`, req, res, (data, response) => {
    if (data.success && data.token) {
      response.cookie("auth_token", data.token, JWT_COOKIE_OPTIONS);
    }
    response.json(data);
  });
});

app.post("/api/auth/logout", (req, res) => {
  forwardToService(`${config.authServiceUrl}/auth/logout`, req, res, (data, response) => {
    const clearOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
    response.clearCookie("auth_token", clearOpts);
    response.clearCookie("refresh_token", clearOpts);
    response.clearCookie("encrypted_token", clearOpts);
    response.clearCookie("token", clearOpts);
    response.json(data);
  });
});

const publicRoutes = [
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/verify-register",
  "/api/auth/verif/verify-register",
  "/api/auth/verify-reset-otp",
  "/api/auth/reset-password",
  "/api/auth/resend-otp",
  "/api/hello",
  "/api/health",
];

app.use((req, res, next) => {
  if (publicRoutes.some(r => req.path.startsWith(r))) {
    return next();
  }
  jwtVerifier(req, res, next);
});

const services = {
  "/api/auth": { target: config.authServiceUrl, pathRewrite: { "^/": "/auth/" } },
  "/api/projects": { target: config.projectServiceUrl, pathRewrite: { "^/": "/projects/" } },
  "/api/members": { target: config.authServiceUrl, pathRewrite: { "^/": "/users/" } },
  "/api/revisions": { target: config.revisionServiceUrl, pathRewrite: { "^/": "/revisions/" } },
  "/api/notifications": { target: config.notificationServiceUrl, pathRewrite: { "^/": "/notifications/" } },
  "/api/files": { target: config.fileServiceUrl, pathRewrite: { "^/": "/files/" } },
  "/api/dashboard": { target: config.dashboardServiceUrl, pathRewrite: { "^/": "/dashboard/" } },
  "/api/test-email": { target: config.emailServiceUrl, pathRewrite: { "^/": "/emails/" } },
};

Object.entries(services).forEach(([route, svc]) => {
  app.use(route, createProxyMiddleware({
    target: svc.target,
    changeOrigin: true,
    pathRewrite: svc.pathRewrite,
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.user) {
          proxyReq.setHeader("X-User-Id", req.user.id);
          proxyReq.setHeader("X-User-Role", req.user.role);
        }
      },
    },
  }));
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

app.get("/api/hello", (req, res) => {
  res.json({ name: "John Doe" });
});

app.use((err, req, res, next) => {
  console.error("[Gateway Error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(config.port, () => {
  console.log(`[Gateway] running on port ${config.port}`);
});
