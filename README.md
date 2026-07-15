# Frontend

Vite + React + TypeScript SPA for Responza AI.

## Folder structure

```
src/
  main.tsx / App.tsx     # entry + providers
  app/                   # router + route guards
  layouts/               # authenticated app chrome (sidebar, topbar)
  features/              # product domains (one folder per feature)
  shared/                # cross-feature infra and UI
  styles/                # Tailwind theme + globals
```

### Features (`src/features/<name>/`)

Every feature uses the same shape (only create folders that have files):

| Folder | Purpose |
|--------|---------|
| `pages/` | Route-level screens |
| `components/` | UI used only by this feature |
| `hooks/` | React hooks for this feature |
| `api/` | `*.service.ts` and domain types |
| `lib/` | Non-React helpers (OAuth, cache merge, checkout, etc.) |
| `constants.ts` | Feature constants (or `legal.constants.ts` when needed) |

Examples: `features/inbox`, `features/auth`, `features/settings`.

`features/ai` is API-only (used by inbox). That is fine — skip empty folders.

### Shared (`src/shared/`)

| Path | Purpose |
|------|---------|
| `api/` | Axios client |
| `auth/` / `realtime/` | Supabase clients (auth vs realtime) |
| `config/` | `VITE_*` accessors |
| `session/` | Token / session storage |
| `hooks/` | Cross-feature hooks (session, gates) |
| `utils/` | Shared helpers |
| `seo/` | Page meta |
| `ui/app-ui.tsx` / `ui/brand-ui.tsx` | App + marketing design primitives |
| `ui/primitives/` | Alert, Select, Spinner |
| `ui/gates/` | Subscription / integrations / Pro lock screens |

## Conventions

- Prefer `@/` imports over deep relative paths.
- Inside a feature, use `lib/` — never `utils/`.
- Feature code should not import another feature’s `pages/` or `components/` unless unavoidable.
- Put new UI next to the feature that owns it; put reusable UI under `shared/ui/`.

## Scripts

```bash
npm run dev      # local Vite server (API proxied to :4000)
npm run build    # typecheck + production build
npm run preview  # preview production build
npm run lint     # ESLint
```
