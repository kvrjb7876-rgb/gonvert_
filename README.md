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

```sh
npx serve .        # or: python3 -m http.server 8000
```

Note: a plain static server does not apply `cleanUrls`, so extensionless links
(`/pharma/services`) 404 locally. Use `npx vercel dev` to preview exactly as
deployed.

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
