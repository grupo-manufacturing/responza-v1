# Frontend

Vite + React + TypeScript marketing site for Responza AI: the landing page, blog, privacy policy and terms.
Every page is prerendered to static HTML at build time (`scripts/prerender.mjs`).

## Folder structure

```
src/
  main.tsx / App.tsx     # entry + providers
  entry-server.tsx       # build-time prerender entry
  app/router/            # routes (all public, see publicRoutes.tsx)
  features/landing/      # landing, privacy, terms and 404 pages
  features/blog/         # blog index, posts and articles
  shared/seo/            # page meta, structured data
  shared/ui/             # marketing UI primitives
  styles/                # Tailwind theme + globals
```

## Scripts

```bash
npm run dev      # local Vite server
npm run build    # typecheck + production build + prerender
npm run preview  # preview production build
npm run lint     # ESLint
```
