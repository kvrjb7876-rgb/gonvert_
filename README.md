# GONVERT — websites

Three static sites deployed as one Vercel project. No build step, no dependencies.

| URL        | Directory  | Site                        |
| ---------- | ---------- | --------------------------- |
| `/`        | `./`       | GONVERT Technology Solutions |
| `/pharma`  | `pharma/`  | GONVERT Pharma Technology   |
| `/energy`  | `energy/`  | GONVERT Renewable Energy    |

Each subsidiary owns its own `assets/` (css, js, logos); the landing page uses the
root `assets/`.

## Local preview

Install [Node.js LTS](https://nodejs.org/) once, then run the Vercel development
server from the repository root:

```sh
npx vercel dev
```

Open `http://localhost:3000/` for the main site, or
`http://localhost:3000/pharma` for the pharma site. The Vercel server applies
the same `cleanUrls` behavior used in deployment, so extensionless links such
as `/pharma/services` work locally too. If Vercel asks to install the CLI,
confirm with `y`.

From PowerShell, the complete next-time setup is:

```powershell
cd "C:\path\to\gonvert_"
npx vercel dev
```

## Deploy

```sh
npx vercel          # preview
npx vercel --prod   # production
```

## Conventions

- `vercel.json` sets `cleanUrls: true` — pages are linked **without** `.html`.
- **All internal links are root-absolute** (`/pharma/services`,
  `/pharma/assets/css/style.css`). This is deliberate: with `trailingSlash: false`,
  `/pharma` has a base URL of `/`, so a relative `assets/css/style.css` on that page
  would resolve to `/assets/css/style.css` and 404. Absolute paths are immune to
  both `cleanUrls` and `trailingSlash` behaviour. Keep new links absolute.
- Consequence: the site must be served from a domain root, not a subdirectory.
- Asset filenames are not content-hashed, so cache headers are left at Vercel's
  revalidating default (ETag/304) — except the 2.5 MB hero video, which gets a
  1-day cache with `stale-while-revalidate`.

## Splitting to subdomains later

The contact addresses (`info@pharma.gonvert.com`, `info@energy.gonvert.com`) suggest
subsidiary subdomains may be wanted eventually. To split, create separate Vercel
projects from `pharma/` and `energy/`, then rewrite only the cross-site links —
`/`, `/pharma`, `/energy` — to absolute `https://` URLs. Everything else already
works unchanged.
