# Tiffin Finder

Warm, culturally inspired web app to discover and order from nearby home kitchens. Built with React + TypeScript, Tailwind, Zustand, and Supabase.

## Tech Stack
- React 18 + TypeScript (Vite)
- Tailwind CSS (custom cultural design)
- Zustand (state management)
- Supabase (auth + Postgres)
- Express (optional local API)

## Setup
1. Install dependencies: `npm install`
2. Copy `/.env.example` to `/.env` and fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Do not put service role keys in the frontend.

## Run
- Frontend only: `npm run client:dev` → `http://localhost:5173`
- Full stack (frontend + backend): `npm run dev`

Pages: `/signup`, `/login`, `/discover`
Debug: `/quick-auth-test`, `/test-auth`, `/debug-auth`

## Database
- Migrations: `supabase/migrations/20241116_initial_schema.sql`
- Apply using Supabase SQL editor or CLI

## Environment
- Secrets are not committed. `.env` is ignored; use `.env.example` for placeholders.

## Scripts
- `npm run dev` — start client and server
- `npm run client:dev` — start client only
- `npm run server:dev` — start local API server

## Deployment
- Set required environment variables on your platform (e.g., Supabase keys)
