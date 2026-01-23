# Aba Memorial Website

## Overview
Hebrew RTL memorial website with public viewing and family admin panel.
Primary access: QR code scan at cemetery.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Supabase (Auth, Database, Storage)
- shadcn/ui (with RTL support)
- React Query
- React Hook Form + Zod
- Tiptap (rich text)
- browser-image-compression

## RTL Rules (CRITICAL)
- Always use logical properties: ps-*, pe-*, ms-*, me-*, start-*, end-*
- Never use: pl-*, pr-*, ml-*, mr-*, left-*, right-*
- Check icon directions (arrows, chevrons)
- Use ChevronLeft instead of ChevronRight for navigation in RTL

## Cemetery First Design (CRITICAL)
- Site accessed outdoors in direct sunlight
- Poor cellular reception expected
- Users may be emotional

### Performance Requirements
- ALL images served via Supabase Image Transformations
- Max image widths: 400px thumbnails, 1200px full
- Initial load under 500KB
- Compress uploads client-side before storage (use browser-image-compression)

### Color Rules
- Navy on Cream: OK for text (high contrast)
- Gold (#b8976a): NEVER for readable text, decorative only

## Design Tokens
- Primary: Navy (oklch(0.25 0.05 250))
- Background: Cream (oklch(0.98 0.01 80))
- Accent: Muted Gold (oklch(0.65 0.1 70)) - borders/icons only
- Headings: Heebo font
- Body: Assistant font

## Project Structure
```
src/
├── components/
│   ├── ui/          # shadcn components (Button, Card, Dialog, etc.)
│   └── shared/      # shared components (layouts, loading states)
├── features/
│   ├── public/      # visitor-facing features (home, story, gallery, etc.)
│   └── admin/       # admin panel features
├── lib/             # utilities (supabase, auth, imageUrl, utils)
├── hooks/           # custom React hooks
├── types/           # TypeScript types (database.types.ts)
└── styles/          # global styles (theme.css with Tailwind config)
```

## Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run linter
- `npm run preview`: Preview production build

## Environment Variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Files
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/auth.ts` - Authentication utilities (magic link, signout)
- `src/lib/imageUrl.ts` - Image URL helpers with Supabase transforms
- `src/lib/imageCompression.ts` - Client-side image compression
- `src/types/database.types.ts` - Database table types
- `src/styles/theme.css` - Tailwind v4 theme configuration

## Database Tables
- `family_members` - Admin users (email, name, role)
- `site_content` - Key-value content (biography, dedication)
- `timeline_events` - Life timeline entries
- `albums` - Photo album metadata
- `photos` - Individual photos with captions
- `recipe_categories` - Recipe category groupings
- `recipes` - Recipe content
- `memories` - Visitor-submitted memories (with moderation)

## Image Handling
Use the helper functions in `src/lib/imageUrl.ts`:
- `getThumbnailUrl(path)` - 400px width for grids
- `getFullSizeUrl(path)` - 1200px width for lightbox
- `getHeroUrl(path)` - 1600px width for hero sections

Always compress before upload using `compressImage()` from `src/lib/imageCompression.ts`.
