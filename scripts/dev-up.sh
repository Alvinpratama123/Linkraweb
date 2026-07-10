#!/bin/bash
echo "=================================="
echo "  Linkraweb ABL - Development Up"
echo "=================================="

if ! command -v docker &> /dev/null; then
  echo "Docker not found. Please install Docker first."
  exit 1
fi

echo "[1/4] Starting MySQL + Redis..."
docker compose up -d mysql redis
sleep 5

echo "[2/4] Generating Prisma clients..."
for svc in auth project revision notification; do
  echo "  → services/$svc"
  cd services/$svc
  npx prisma generate 2>/dev/null
  npx prisma db push --accept-data-loss 2>/dev/null
  cd ../..
done

echo "[3/4] Installing dependencies..."
npm --prefix gateway install
for svc in auth project revision notification file email dashboard; do
  npm --prefix services/$svc install
done
npm --prefix frontend install

echo "[4/4] Starting all services (dev mode)..."
echo ""
echo "  Gateway    → http://localhost:8080"
echo "  Auth       → http://localhost:3001"
echo "  Project    → http://localhost:3002"
echo "  Revision   → http://localhost:3003"
echo "  Notif      → http://localhost:3004"
echo "  File       → http://localhost:3005"
echo "  Email      → http://localhost:3006"
echo "  Dashboard  → http://localhost:3007"
echo "  Frontend   → http://localhost:3000"
echo ""

npm --prefix gateway run dev &
npm --prefix services/auth run dev &
npm --prefix services/project run dev &
npm --prefix services/revision run dev &
npm --prefix services/notification run dev &
npm --prefix services/file run dev &
npm --prefix services/email run dev &
npm --prefix services/dashboard run dev &
npm --prefix frontend run dev &

echo "All services started. Press Ctrl+C to stop."
wait
