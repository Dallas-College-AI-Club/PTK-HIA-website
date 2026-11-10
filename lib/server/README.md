# Shared backend code

API endpoints belong in `app/api/<endpoint>/route.ts`, using the project's
Next.js App Router structure. They receive frontend requests and return responses.
For example, the chatbot endpoint lives at `app/api/chat/route.ts`.

Put reusable backend logic in `lib/server/`, such as resource search, database
access helpers, and AI provider integrations. API route handlers can call these
modules to keep request handling separate from shared logic. Existing database
files in `lib/db/` remain in place.

Server-only modules must never be imported into frontend Client Components
(files marked with `"use client"`) or modules used by those components. Call an
API endpoint from the frontend when server logic is needed.

Credentials, including API keys, passwords, and database connection strings,
must use server-side environment variables. Keep local values in `.env.local`
and configure deployed values in Vercel Environment Variables. Never commit
credentials or `.env` files, and never expose secrets through `NEXT_PUBLIC_`
environment variables.

`app/api/health/` is reserved for a future health endpoint. Its empty `.gitkeep`
only allows Git to track the folder; it does not create a working endpoint.
This setup adds no health handler, database connections or models, AI
integration, or authentication.
