# Meir Tamam Memorial Website

A Hebrew (RTL) memorial website designed to be accessed via QR code at a cemetery.

## Features

- **Public Pages**: Home, Biography/Timeline, Photo Gallery, Recipe Book, Memory Wall
- **Admin Panel**: Content management for family members
- **Optimized for Cemetery Use**: High contrast, minimal data usage, fast loading

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Supabase (Auth, Database, Storage)
- shadcn/ui components
- React Query, React Hook Form, Zod

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Design Considerations

This site is designed for use in cemetery environments:
- High contrast colors for outdoor visibility
- Minimal data usage for poor cellular reception
- Simple, emotional-state-friendly UI
