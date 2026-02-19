---
name: lakbay-region8-stack
description: >
  Use this skill when building or scaffolding any part of the Lakbay Region 8
  tourism discovery web app. Covers Next.js 14 App Router + TypeScript +
  Tailwind CSS (frontend), Supabase PostgreSQL + Storage (backend), and
  Mapbox GL JS (maps). Apply whenever generating pages, components, API routes,
  database queries, storage helpers, map integrations, or SEO metadata for this
  project.
---

# Lakbay Region 8 – Stack Skill

## 1. Project Overview

Lakbay Region 8 is an SEO-optimised tourism discovery platform for Eastern Visayas. Phase 1 ships 20 curated destinations with an interactive map, real-time search, and static detail pages. There are **no** user accounts, bookings, or reviews in this phase.

**Performance targets**
- Page load < 2.5 s (Core Web Vitals green)
- Indexed by Google within 30 days of launch
- Destination found in < 3 clicks

---

## 2. Tech Stack at a Glance

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend   | Supabase (PostgreSQL + Storage)     |
| Maps      | Mapbox GL JS                        |
| Hosting   | Vercel (frontend) + Supabase Cloud (DB/storage) |

---

## 3. Folder Architecture

Follow the structure below exactly. Do **not** deviate without a documented reason.

```
/app
  layout.tsx                  ← root layout: fonts, global metadata, Navbar, Footer
  page.tsx                    ← landing page (SSR)
  /map
    page.tsx                  ← full-screen map (Client Component)
  /destinations
    /[slug]
      page.tsx                ← destination detail (SSR with generateStaticParams)

/components
  Navbar.tsx
  Footer.tsx
  SearchBar.tsx               ← controlled, debounced
  CategoryFilter.tsx          ← Beach | Nature | Heritage | Adventure
  DestinationCard.tsx
  MapView.tsx                 ← wraps Mapbox; always 'use client'
  MapPopup.tsx
  ImageGallery.tsx

/lib
  supabase.ts                 ← createClient (server + browser variants)
  queries.ts                  ← all DB query functions
  mapbox.ts                   ← token export + helper types
  utils.ts                    ← cn(), slugify(), formatFee(), etc.

/types
  destination.ts              ← shared TypeScript interfaces

/styles
  globals.css                 ← Tailwind directives + CSS variables
```

---

## 4. TypeScript Types

Always import from `/types/destination.ts`. Define **once**, use everywhere.

```ts
// /types/destination.ts

export interface Destination {
  id: string;               // uuid
  name: string;
  slug: string;             // url-safe, unique
  province: Province;
  category: Category;
  description: string;
  entrance_fee: string;     // e.g. "₱50" | "Free"
  hours: string;            // e.g. "6:00 AM – 6:00 PM"
  latitude: number;
  longitude: number;
  google_maps_link: string;
  travel_tips: string;
  created_at: string;       // ISO timestamp
}

export interface DestinationImage {
  id: string;
  destination_id: string;
  image_url: string;        // Supabase public storage URL
  created_at: string;
}

export type Province =
  | 'Leyte'
  | 'Southern Leyte'
  | 'Eastern Samar'
  | 'Northern Samar'
  | 'Western Samar'
  | 'Biliran';

export type Category = 'Beach' | 'Nature' | 'Heritage' | 'Adventure';

export interface DestinationWithImages extends Destination {
  destination_images: DestinationImage[];
}
```

---

## 5. Supabase Setup

### 5.1 Client Creation

```ts
// /lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser / Client Component client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server Component client (uses the same anon key for Phase 1 – no auth)
export const createServerClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
```

### 5.2 Database Schema (SQL)

Run once in Supabase SQL Editor. Include `slug` and `travel_tips` columns that the PRD implies.

```sql
-- destinations
create table destinations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  province      text not null,
  category      text not null,
  description   text not null,
  entrance_fee  text not null default 'Free',
  hours         text not null,
  latitude      double precision not null,
  longitude     double precision not null,
  google_maps_link text,
  travel_tips   text,
  created_at    timestamptz not null default now()
);

-- destination_images
create table destination_images (
  id              uuid primary key default gen_random_uuid(),
  destination_id  uuid references destinations(id) on delete cascade,
  image_url       text not null,
  created_at      timestamptz not null default now()
);

-- indexes for search performance
create index on destinations (province);
create index on destinations (category);
create index on destinations using gin (to_tsvector('english', name || ' ' || description));
```

### 5.3 Query Functions

All DB access goes through `/lib/queries.ts`. Never call `supabase` directly inside components.

```ts
// /lib/queries.ts
import { createServerClient } from './supabase';
import type { DestinationWithImages } from '@/types/destination';

export async function getAllDestinations(): Promise<DestinationWithImages[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('destinations')
    .select('*, destination_images(*)')
    .order('name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDestinationBySlug(
  slug: string
): Promise<DestinationWithImages | null> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('destinations')
    .select('*, destination_images(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function searchDestinations(
  query: string,
  province?: string,
  category?: string
): Promise<DestinationWithImages[]> {
  const sb = createServerClient();
  let req = sb
    .from('destinations')
    .select('*, destination_images(*)')
    .order('name');

  if (query) req = req.ilike('name', `%${query}%`);
  if (province) req = req.eq('province', province);
  if (category) req = req.eq('category', category);

  const { data, error } = await req;
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

### 5.4 Storage

- Bucket name: `destination-images` (public)
- Path convention: `{destination_id}/{filename}`
- Always use the public URL pattern:  
  `{SUPABASE_URL}/storage/v1/object/public/destination-images/{path}`
- Use `next/image` with `remotePatterns` configured for the Supabase domain.

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
```

---

## 6. Mapbox GL JS

### 6.1 Token

```ts
// /lib/mapbox.ts
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export const REGION8_CENTER: [number, number] = [125.0, 11.5]; // [lng, lat]
export const REGION8_ZOOM = 8;
```

### 6.2 MapView Component

Mapbox **must** be a Client Component because it needs the DOM.

```tsx
// /components/MapView.tsx
'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, REGION8_CENTER, REGION8_ZOOM } from '@/lib/mapbox';
import type { Destination } from '@/types/destination';

interface MapViewProps {
  destinations: Destination[];
  className?: string;
}

export default function MapView({ destinations, className }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: REGION8_CENTER,
      zoom: REGION8_ZOOM,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    destinations.forEach((dest) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${dest.name}</strong><br/>${dest.province}<br/>
         <a href="/destinations/${dest.slug}" class="text-blue-600 underline">View Details →</a>`
      );

      new mapboxgl.Marker({ color: '#16a34a' })
        .setLngLat([dest.longitude, dest.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [destinations]);

  return <div ref={mapContainer} className={className ?? 'h-full w-full'} />;
}
```

### 6.3 Map Page

```tsx
// /app/map/page.tsx
import { getAllDestinations } from '@/lib/queries';
import MapView from '@/components/MapView';

export default async function MapPage() {
  const destinations = await getAllDestinations();
  return (
    <main className="h-[calc(100vh-64px)] w-full">
      <MapView destinations={destinations} className="h-full w-full" />
    </main>
  );
}
```

---

## 7. Search & Filtering

Search is client-side filtered against an already-fetched list for instant feedback (20 items = negligible memory cost).

```tsx
// /components/SearchBar.tsx
'use client';

import { useState, useTransition } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    startTransition(() => onSearch(v));
  };

  return (
    <input
      type="search"
      value={value}
      onChange={handleChange}
      placeholder="Search destinations, provinces…"
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="Search destinations"
    />
  );
}
```

```tsx
// /components/CategoryFilter.tsx
'use client';

import type { Category } from '@/types/destination';

const CATEGORIES: Category[] = ['Beach', 'Nature', 'Heritage', 'Adventure'];

interface CategoryFilterProps {
  active: Category | null;
  onChange: (cat: Category | null) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors
            ${active === cat
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

---

## 8. SEO Patterns

Use Next.js `generateMetadata` on every page. Never skip it.

```ts
// Example: /app/destinations/[slug]/page.tsx

import type { Metadata } from 'next';
import { getDestinationBySlug, getAllDestinations } from '@/lib/queries';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const dest = await getDestinationBySlug(params.slug);
  if (!dest) return {};
  return {
    title: `${dest.name} – Lakbay Region 8`,
    description: dest.description.slice(0, 160),
    openGraph: {
      title: dest.name,
      description: dest.description.slice(0, 160),
      images: dest.destination_images[0]?.image_url
        ? [{ url: dest.destination_images[0].image_url }]
        : [],
    },
  };
}

export default async function DestinationPage(
  { params }: { params: { slug: string } }
) {
  const dest = await getDestinationBySlug(params.slug);
  if (!dest) notFound();
  // render page…
}
```

### robots.txt / sitemap

Add `app/sitemap.ts` and `app/robots.ts` to satisfy the "indexed within 30 days" goal.

```ts
// /app/sitemap.ts
import { getAllDestinations } from '@/lib/queries';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const destinations = await getAllDestinations();
  const base = 'https://lakbayregion8.com'; // replace with real domain

  const destUrls = destinations.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: d.created_at,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/map`, changeFrequency: 'monthly', priority: 0.6 },
    ...destUrls,
  ];
}
```

---

## 9. Destination Card Component

```tsx
// /components/DestinationCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { DestinationWithImages } from '@/types/destination';

interface DestinationCardProps {
  destination: DestinationWithImages;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const hero = destination.destination_images[0]?.image_url ?? '/placeholder.jpg';

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={hero}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          {destination.category}
        </span>
        <h2 className="text-base font-bold text-gray-900 group-hover:text-green-700">
          {destination.name}
        </h2>
        <p className="text-xs text-gray-500">{destination.province}</p>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {destination.description}
        </p>
      </div>
    </Link>
  );
}
```

---

## 10. Environment Variables

Create `.env.local` (never commit to git):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
```

Add all three to Vercel → Project → Environment Variables before deploying.

---

## 11. Tailwind Configuration Notes

- Use `tailwind.config.ts` with `content` paths including `/app/**` and `/components/**`.
- Extend the theme with Region 8's brand green: `primary: '#16a34a'` (Tailwind `green-600`).
- Enable `darkMode: 'class'` even if not used in Phase 1 (easy to add later).

---

## 12. Performance Checklist

Before any deployment, verify:

- [ ] All `<Image>` tags have `sizes` and `priority` on above-the-fold images
- [ ] Map page uses `dynamic(() => import('../components/MapView'), { ssr: false })` if SSR causes issues
- [ ] `generateStaticParams` is present on `[slug]` page (SSG for all 20 destinations)
- [ ] No `console.log` or debug code in production paths
- [ ] Supabase queries run server-side (not in Client Components unless necessary)
- [ ] `sitemap.ts` and `robots.ts` are in `/app`
- [ ] Lighthouse score > 90 on mobile before final deploy

---

## 13. Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Mapbox imported in Server Component | Add `'use client'` to any file that imports `mapbox-gl` |
| Hydration mismatch on MapView | Wrap with `dynamic(..., { ssr: false })` in parent |
| Supabase client created inside render loop | Export a singleton from `supabase.ts` |
| Images not loading on Vercel | Check `remotePatterns` in `next.config.ts` |
| Slug collisions | Ensure `slug` column has `UNIQUE` constraint; use `slugify(name + province)` |
| Missing `travel_tips` in DB | The PRD detail page requires it; include in schema from day one |

---

## 14. Seed Data Template

Use this TypeScript object shape when inserting seed data via Supabase Studio or a seed script:

```ts
{
  name: 'Kalanggaman Island',
  slug: 'kalanggaman-island',
  province: 'Leyte',
  category: 'Beach',
  description: 'A pristine sandbar island off the coast of Palompon, Leyte, famous for its crystal-clear waters and powdery white sand.',
  entrance_fee: '₱200',
  hours: 'Daytrip only (6:00 AM – 5:00 PM)',
  latitude: 11.2833,
  longitude: 124.3167,
  google_maps_link: 'https://maps.google.com/?q=Kalanggaman+Island',
  travel_tips: 'Book a boat in Palompon. Bring food and water—no stores on the island. Arrive early for calm seas.',
}
```

---

*This SKILL.md is scoped to Lakbay Region 8 Phase 1 (MVP). Update it before starting Phase 2 when user accounts, CMS, and itinerary features are added.*
