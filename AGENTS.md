# Linkraweb — AGENTS.md (ABL Architecture)

## Architecture

**Arsitektur Berbasis Layanan (ABL)** — 1 API Gateway + 7 Services + 1 Frontend + 1 MySQL + 1 Redis.

```
Linkraweb/
├── gateway/          ← API Gateway (Express, port 8080)
├── services/
│   ├── auth/         ← Auth Service (port 3001) — auth_db
│   ├── project/      ← Project Service (port 3002) — project_db
│   ├── revision/     ← Revision Service (port 3003) — monitoring_db
│   ├── notification/ ← Notification Service (port 3004) — monitoring_db
│   ├── file/         ← File Service (port 3005)
│   ├── email/        ← Email Service (port 3006) — nodemailer
│   └── dashboard/    ← Dashboard Service (port 3007) — aggregation
├── frontend/         ← Next.js murni (tanpa API routes)
├── src/pages/        ← Halaman frontend (legacy, porting ke frontend/)
├── prisma/           ← Schema: auth/, project/, monitoring/
└── scripts/          ← dev-up.sh, build-all.sh
```

## Quick start

```bash
cd Linkraweb
docker compose up -d mysql redis      # MySQL 8.0 + Redis 7
bash scripts/dev-up.sh                # Start semua service (dev mode)
```

Atau satu per satu:
```bash
npm run dev:auth          # Auth Service :3001
npm run dev:project       # Project Service :3002
npm run dev:gateway       # Gateway :8080
```

## Service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Gateway | http://localhost:8080 |
| Auth | http://localhost:3001 |
| Project | http://localhost:3002 |
| Revision | http://localhost:3003 |
| Notification | http://localhost:3004 |
| File | http://localhost:3005 |
| Email | http://localhost:3006 |
| Dashboard | http://localhost:3007 |

## Key commands

| Command | What |
|---|---|
| `npm run dev` | Start all services (dev mode) |
| `npm run dev:gateway` | Gateway only |
| `npm run dev:auth` | Auth Service only |
| `npm run dev:project` | Project Service only |
| `npm run dev:revision` | Revision Service only |
| `npm run dev:notification` | Notification Service only |
| `npm run dev:file` | File Service only |
| `npm run dev:email` | Email Service only |
| `npm run dev:dashboard` | Dashboard Service only |
| `npm run dev:frontend` | Frontend Next.js only |
| `npm run db:generate` | Generate Prisma clients for all services |
| `npm run db:push` | Push schema to MySQL (all services) |

## Communication

- **Synchronous (REST):** Client → Gateway → Service (via `http-proxy-middleware`)
- **Asynchronous (Event):** Service → Redis Pub/Sub → Service (e.g. Auth → Email, Project → Notification)

Gateway handles JWT verification and passes `X-User-Id` / `X-User-Role` headers to all services.

## Database

- `auth_db` — User, RegisterOtp, PasswordResetToken
- `project_db` — Project, Attachment
- `monitoring_db` — RevisionReport, RevisionComment, Notification

## Environment

- `.env` contains dev defaults. Copy to `.env.local` for overrides.
- Each service reads its own env vars (DB URL, port, SMTP, Redis).
- `NEXT_PUBLIC_GATEWAY_URL` is used by frontend to call Gateway.
- `NEXT_PUBLIC_ENCRYPTION_KEY` for client-side crypto-js.

## Frontend

Pages are in `src/pages/` (legacy) but will be moved to `frontend/`. All API calls go through `frontend/src/lib/apiClient.js` which routes to `http://localhost:8080/api/*` (Gateway). No API routes exist in the frontend.
