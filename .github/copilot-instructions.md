<!-- .github/copilot-instructions.md - guidance for AI coding assistants -->

# Project snapshot

- This is a Next.js (App Router) application. Main app code lives in `app/` (server + client components) and UI pieces in `components/`.
- Dev server and scripts are defined in `package.json` (`dev`, `build`, `start`, `lint`, `format`). Use `npm run dev` to start local development.

# Big-picture architecture (what to know first)

- Routing / UI: `app/` contains the App Router layout and pages. `app/layout.js` wraps the app with global providers: `QueryClientProvider` (React Query) and `LoaderProvider` (see `context/LoaderContext.jsx`).
- Data layer: network calls are wrapped in `lib/api.js`. Business/service logic lives in `services/` (for example, `services/authService.js`).
- State: lightweight client state uses Zustand stores in `store/` (e.g., `useAuthStore.js`, `useProductStore.js`). Use React Query for server state (default options set in `app/layout.js`).
- API proxy: `next.config.mjs` rewrites `/api/proxy/:path*` to `https://arcmat-api.vercel.app/api/:path*` — mind this when tracing network requests.

# Key developer workflows & commands

- Start dev server: `npm run dev` (default host: http://localhost:3000).
- Build for production: `npm run build` then `npm run start`.
- Linting & formatting: `npm run lint` and `npm run format` (Prettier).
- If you need to emulate backend API calls locally, remove/adjust the rewrite in `next.config.mjs` or call the external API directly (the rewrite hides the real API host behind `/api/proxy`).

# Project-specific conventions and patterns

- Path alias: the repo uses `@/` for root imports (see `jsconfig.json`). Prefer `@/components/...` over relative chains.
- Client vs Server components: many components are client-style (they include `"use client"`). When editing a file, check for `"use client"` at top — if present, avoid using server-only APIs inside it.
- Data fetching: prefer `@tanstack/react-query` for async/server data (queries are initialized with `staleTime: 60_000` and `refetchOnWindowFocus: false` in `app/layout.js`).
- Auth: authentication is coordinated via `services/authService.js`, `lib/api.js`, and `store/useAuthStore.js`. UI guards exist in `components/auth/` (`AuthGuard.jsx`, `RoleGaurd.jsx`) — use these when adding protected routes.
- UI and layout: global CSS is in `app/globals.css`; components follow the `components/` and `components/*/*` structure (see `components/navbar/`, `components/dashboard/`, `components/vendor/`).

# Important integration points to watch

- External API: proxied through `next.config.mjs` to `arcmat-api.vercel.app`. Tests or new endpoints should reflect that.
- Websockets: `socket.io-client` is included — search for `socket.io` usage when adding real-time features.
- File uploads / Excel: `xlsx` is used in several vendor flows (bulk upload features live in `components/vendor/`).

# Examples (where to look for patterns)

- Global providers: `app/layout.js` — sets up React Query and `LoaderProvider`.
- API wrapper: `lib/api.js` — centralize request headers, auth token handling, and error behavior.
- Auth flow: `services/authService.js` + `store/useAuthStore.js` + `components/auth/*`.
- Vendor/product admin UIs: `components/vendor/` (forms and bulk actions) and `components/cards/ProductCard.jsx` for product presentation.

# How the AI should operate in this repo

- When modifying UI, preserve `use client` annotations; for shared logic prefer adding helpers under `lib/` or `services/`.
- When adding data fetching, use React Query and the existing `QueryClient` defaults (no window-focus refetch by default).
- For auth-protected work, update `useAuthStore.js` and confirm UIs use `AuthGuard.jsx` or `RoleGaurd.jsx` where appropriate.
- Use `@/` imports consistently and run `npm run lint` / `npm run format` after edits.

# Quick checklist for PRs

- Run `npm run dev` and verify changes locally.
- Confirm network paths that depend on the `next.config.mjs` rewrite.
- Ensure imports use `@/` alias and no unresolved relative paths.
- Run `npm run format` and `npm run lint` before opening PR.

---

If any of these areas are unclear or you want more examples (e.g., exact request flow for products or auth), tell me which file or feature to expand and I will update this guidance.
