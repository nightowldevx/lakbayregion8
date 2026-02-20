# Lakbay Region 8

> Discover Eastern Visayas - an interactive guide to the destinations, heritage, and natural wonders of Region 8, Philippines.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-map-396CB2)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

**Lakbay Region 8** is a public-facing tourism discovery platform for Eastern Visayas. It lets travellers explore beaches, heritage sites, nature trails, and adventure spots across all six provinces - with a filterable destination grid, an interactive map, and detailed destination pages with photos, travel tips, and directions.

## About the Project

**Lakbay Region 8** is an open-source tourism guide built with Next.js, Supabase, and OpenFreeMap. It was created as a portfolio project with the goal of showcasing Region 8's destinations in a clean, modern, and accessible web experience.

All destination data — including descriptions, coordinates, entrance fees, and hours — was compiled from publicly available sources and local tourism boards. This project is not affiliated with any government agency.

### Image Credits

All destination images displayed on this site are the property of their respective owners and photographers. Images are used for informational and non-commercial purposes only. If you are the rightful owner of an image and would like it removed or properly attributed, please open an issue or contact me ASAP.

---

## Use Cases

| Who | What they do |
|---|---|
| **Tourists** | Browse destinations by category or province, view photos, get travel tips, and open Google Maps directions |
| **Local explorers** | Use the interactive map to discover nearby spots across Region 8 |
| **Travel bloggers** | Reference accurate destination info — entrance fees, hours, and province |
| **Tourism offices** | Showcase regional destinations with a modern, mobile-friendly platform |

---

## Features

- **Destination Grid** — Browse all destinations with search, category filter (Beach · Nature · Heritage · Adventure), and province filter
- **Interactive Map** — MapLibre GL-powered map with 4 switchable styles (Classic Street, Midnight Dark, Minimal White, Satellite), green pin markers, and click-to-navigate popups
- **Map Sidebar** — Grouped destination list, click any entry to fly the map to the exact location
- **Destination Detail Pages** — Hero photo, image gallery, description, travel tips, entrance fee, hours, and embedded Google Maps
- **Related Destinations** — "More in [Province]" section at the bottom of each detail page
- **Dark Mode** — Full dark/light/system theme support via next-themes
- **About Page** — Mission, province breakdown, and project context
- **Mobile Optimised** — Responsive layout across all screen sizes
- **Accurate Map Pins** — Coordinates parsed directly from Google Maps embed URLs for precision placement

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL + RLS) |
| Image Hosting | ImageKit |
| Map | MapLibre GL + OpenFreeMap tiles |
| Theming | next-themes |
| Language | TypeScript |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/lakbay-region8.git
cd lakbay-region8
npm install
```

### 2. Set up environment variables

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Get these from **Supabase → Project Settings → API**.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  page.tsx              # Landing page
  destinations/[slug]/  # Destination detail page
  map/                  # Interactive map page
  about/                # About page
components/
  DestinationCard.tsx   # Landscape card with image overlay
  DestinationGrid.tsx   # Filterable grid
  MapView.tsx           # MapLibre GL map
  MapSidebar.tsx        # Destination list panel
  MapStyleSwitcher.tsx  # 4-style tile switcher
lib/
  queries.ts            # All Supabase queries (server-side only)
  maplibre.ts           # Map styles + coordinate utilities
types/
  destination.ts        # Shared TypeScript interfaces
```

---

## License

MIT © 2026 Lakbay Region 8
