# SCM Control — Software Configuration Management Dashboard

## Overview
A Next.js 15 dashboard for managing software configurations: equipment, components, revisions, change requests, and software packages.

## Architecture
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Replit PostgreSQL (credentials via environment variables only)
- **Package manager**: pnpm

## Running the app
The workflow `Start application` runs `pnpm run dev` on port 5000.

## Database

### Connection
Credentials are **never in code**. The app reads from environment variables automatically set by Replit:
- `DATABASE_URL` — full connection string (used by `lib/db.ts`)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — individual vars

### Schema (7 tables)
| Table | Description |
|---|---|
| `equipment` | Top-level hardware units |
| `top_level_software` | Software bundles per equipment |
| `components` | Individual software components |
| `component_revisions` | Versioned builds of each component |
| `change_requests` | CRs that drive component changes |
| `software_packages` | Deployable packages grouping revisions |
| `package_contents` | Junction: packages ↔ revisions |

### Key files
- `lib/db.ts` — PostgreSQL connection pool (reads `DATABASE_URL`)
- `lib/db-queries.ts` — Server-side query functions (mirrors `lib/scm-store.ts` API)
- `lib/scm-store.ts` — Original hardcoded data store (still used by client pages)
- `lib/scm-types.ts` — TypeScript interfaces for all entities

### Migrating pages to live DB
Pages currently use `lib/scm-store.ts` (hardcoded). To connect to the database,
replace imports in each page with calls to `lib/db-queries.ts` from a Server Component or API route.
