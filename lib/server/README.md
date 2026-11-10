# Backend structure

Put HTTP endpoints in `app/api/<name>/route.ts`. Each route handler receives a
request and returns a response. For example, `app/api/chat/route.ts` handles
requests to `/api/chat`.

Put reusable server logic in `lib/server/`. Database queries, resource search,
and AI provider calls can live here as those features are added. Keep request
handling in the route and call the shared module from server code.

Keep this logic out of Client Components. Next.js includes a file marked
`"use client"` and its imports in the browser bundle. Use `import "server-only"` at the top of
modules that need the server boundary so Next.js can catch accidental client
imports. See the [Next.js server and client guide](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning).

Read credentials from server environment variables. Use `.env.local` for local
Next.js development and the hosting provider's environment settings for deployed
environments. Keep real credentials out of Git, client responses, and variables
prefixed with `NEXT_PUBLIC_`. Use placeholders in `.env.example`.

The empty `app/api/health/.gitkeep` tracks the reserved health route folder in
Git. Issue #4 replaces the placeholder with a route handler.

## Verify the layout

Run `git ls-files app/api/health lib/server` from the repository root. On the
issue #5 branch, it should list `app/api/health/.gitkeep` and this guide. The
placeholder has no executable content.
