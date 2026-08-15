# Aba Memorial Website

## Overview
Hebrew RTL memorial website for Meir Tamam z"l. Fully static PWA —
no backend, no database, no auth. Primary access: QR code scan at cemetery.
Content lives in TypeScript files under `src/content/`; family edits + git push
trigger automatic deployment to GitHub Pages.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7
- vite-plugin-pwa (offline support, installable)
- lucide-react (icons)
- Hosted on GitHub Pages (base path `/Meir_Tamam_Memorial/`)

## RTL Rules (CRITICAL)
- Always use logical properties: ps-*, pe-*, ms-*, me-*, start-*, end-*
- Never use: pl-*, pr-*, ml-*, mr-*, left-*, right-*
- Check icon directions: "back" points right (ChevronRight), "next" points left (ChevronLeft)
- In the lightbox, swiping right advances (like turning a page in a Hebrew book)

## Cemetery First Design (CRITICAL)
- Site accessed outdoors in direct sunlight
- Poor cellular reception expected
- Users may be emotional

### Performance Requirements
- All images pre-optimized before committing: max 1200px wide, WebP/JPEG, under ~300KB
- Everything is precached by the service worker — site works offline after first visit
- Initial load under 500KB

### Color Rules
- Navy on Cream: OK for text (high contrast)
- Gold (#b8976a / oklch(0.65 0.1 70)): NEVER for readable text, decorative only

## Design Tokens
- Primary: Navy (oklch(0.25 0.05 250))
- Background: Cream (oklch(0.98 0.01 80))
- Accent: Muted Gold (oklch(0.65 0.1 70)) - borders/icons only
- Headings: Heebo font
- Body: Assistant font

## Project Structure
```
src/
├── components/      # Layout (bottom nav), MemorialCandle, Lightbox
├── content/         # ALL site content lives here (see CONTENT_GUIDE.md)
│   ├── profile.ts   # name, dates, quotes, home page text
│   ├── story.ts     # life story chapters with woven images
│   ├── timeline.ts  # timeline events
│   ├── gallery.ts   # photo albums
│   ├── words.ts     # eulogies / memorial words
│   └── types.ts     # content type definitions
├── lib/assets.ts    # asset() helper — resolves public/ paths with base URL
├── pages/           # HomePage, StoryPage, GalleryPage, AlbumPage, WordsPage
└── styles/theme.css # Tailwind v4 theme + memorial CSS (candle animation etc.)
public/images/       # photo files (pre-optimized)
scripts/generate-icons.mjs  # regenerates PWA icons (npm run icons)
scripts/prepare-photos.mjs  # batch-prepares scanned photos (npm run photos)
.github/workflows/deploy.yml # auto-deploy to GitHub Pages on push to main
```

## Routes
- `/` home, `/story` life story + timeline, `/gallery` albums,
  `/gallery/:albumId` album with lightbox, `/words` memorial words

## Commands
- `npm run dev`: Start development server
- `npm run build`: Type-check + build + copy 404.html (SPA fallback for Pages)
- `npm run lint`: Run linter
- `npm run preview`: Preview production build
- `npm run icons`: Regenerate PWA icons
- `npm run photos -- --in <dir> --out images/<path>`: Batch-prepare scanned
  photos — EXIF orientation, scanner-border crop, deskew, resize to 1200px,
  compress under 300KB. Writes a review page to `photo-review/` (gitignored)
  for the manual 90°/180° rotations the detector can't infer; feed the
  resulting `rotations.json` back with `--rotations`.

## Content Editing
See CONTENT_GUIDE.md (Hebrew) — the guide the family uses to update content.
When adding content programmatically, follow the same rules: images must be
pre-optimized (squoosh.app, 1200px max), paths relative to public/ resolved
via `asset()` from `src/lib/assets.ts`.

## Deployment
Two supported targets (both work from the same code; QR points at whichever is live):
- **GitHub Pages**: push to `main` → GitHub Actions deploys.
  One-time setup: Settings → Pages → Source → GitHub Actions.
  URL: https://<user>.github.io/Meir_Tamam_Memorial/
- **Vercel**: import the repo at vercel.com → auto-deploys on every push.
  Vercel sets the VERCEL env var, so vite.config.ts switches base to `/`;
  vercel.json handles the SPA rewrite. Custom domain configurable in Vercel.
```
