# Linkraweb — AGENTS.md

## Project structure

- **All source is inside `Linkraweb/`** — this is the repo root for all commands.
- Next.js **Pages Router** (not App Router). Routes at `src/pages/`.
- Pure JavaScript (no TypeScript). Path alias `@/*` → `./src/*` (`jsconfig.json`).
- **npm** is the package manager (`package-lock.json` present).

## Quick start

```bash
cd Linkraweb
docker compose up -d          # start MySQL 8.0
cp .env .env.local            # .env is already committed; for local overrides use .env.local
npx prisma generate           # outputs to src/generated/prisma/ (gitignored)
npx prisma db push            # sync schema to MySQL
npm run dev                   # → http://localhost:3000
```

## Key commands

| Command | What |
|---|---|
| `npm run dev` | dev server on :3000 |
| `npm run build` | production build |
| `npm run start` | start production server |
| `npm run lint` | ESLint (Next.js core-web-vitals preset) |
| `npx prisma generate` | regenerate Prisma client after schema changes |
| `npx prisma db push` | push schema to MySQL without migrations |
| `npx prisma studio` | Prisma GUI (runs on :5555) |

No test framework is configured.

## Auth architecture

Login is a **two-step flow**:

1. `POST /api/auth/login` — validate password via bcrypt, create 15-min `LoginToken`, send magic-link email via nodemailer.
2. User clicks link → `GET /api/auth/verif/verify-login?token=...` — marks token used, sets `auth_token` (JWT, HttpOnly, 7d), redirects to `/dashboardAdmin/admin`.

- Forgot-password is **not implemented** (toast "Fitur dalam pengembangan").
- User data stored in `localStorage` after initial POST; JWT in `auth_token` cookie.
- `GET /api/auth/me` reads JWT from cookie to return user profile.
- Register accepts roles: `frontend`, `backend`, `uiux`, `qa`, `pm`, `admin`.

## Environment

- `.env` (tracked) contains dev defaults for DB, mail, and JWT. **Mail credentials are real/test credentials** — do not commit production secrets.
- `NEXT_PUBLIC_ENCRYPTION_KEY` is used client-side (crypto-js) — defaults to a hardcoded fallback if not set.

## Notable details

- **Prisma client** is generated to `src/generated/prisma/` and gitignored. Always run `npx prisma generate` after schema changes.
- **MySQL via Docker** — `docker-compose.yml` at `Linkraweb/`. Database: `lintas_wahana`, user: `lw_user`.
- **Tailwind CSS v4** — uses `@tailwindcss/postcss` PostCSS plugin (not the legacy `tailwind.config.js` approach).
- **File uploads** use `formidable` (server) and `multer` (listed in deps but not yet used based on current routes).
- **Login token** cleanup: old unused tokens for a user are deleted before creating a new one.
- Admin dashboard at `/dashboardAdmin/admin`; member dashboard at `/memberDashboard/MemberDashboard`.
- Settings pages: `/settings/profile`, `/settings/changepassword`, `/settings/settingsTema`.
