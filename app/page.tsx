

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DestinationGrid from '@/components/DestinationGrid';
import { getAllDestinations } from '@/lib/queries';
import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lakbay Region 8 – Discover Eastern Visayas',
  description:
    'Explore 20 curated destinations across Eastern Visayas — beaches, heritage sites, nature trails, and adventures in Leyte, Samar, and Biliran.',
};

const STATS = [
  { value: '21', label: 'Destinations' },
  { value: '6', label: 'Provinces' },
  { value: '4', label: 'Categories' },
] as const;

export default async function HomePage() {
  const destinations = await getAllDestinations();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="https://picsum.photos/seed/region8-hero/1920/1080"
          alt="Scenic landscape of Eastern Visayas"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            Eastern Visayas Tourism
          </p>
          <h1 className="font-display text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Discover{' '}
            <span className="text-green-300">Eastern</span>
            <br />
            <span className="text-green-300">Visayas</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Explore pristine beaches, ancient heritage sites, breathtaking
            natural wonders, and thrilling adventures across 6 provinces of
            Region 8.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-800 hover:bg-green-50 font-bold px-10 shadow-xl text-base"
            >
              <a href="#destinations">Explore Destinations</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 font-semibold px-10 text-base"
            >
              <Link href="/map">View Map</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#stats"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="size-5 animate-bounce" />
        </a>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────── */}
      <section id="stats" className="bg-[#f5f0e8] dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="flex items-stretch justify-center divide-x divide-[#d4c9b0] dark:divide-gray-700">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2 px-6 py-4 text-center">
                <span className="text-5xl font-black text-green-700 dark:text-green-400 leading-none">
                  {value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#7a6e5f] dark:text-gray-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations grid ───────────────────────────────────── */}
      <section
        id="destinations"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a] dark:text-white sm:text-4xl">
            All Destinations
          </h2>
          <p className="mt-2 text-gray-500">
            {destinations.length} places to discover in Eastern Visayas
          </p>
        </div>
        <DestinationGrid destinations={destinations} />
      </section>

      <Separator />

      {/* ── Map teaser ──────────────────────────────────────────── */}
      <section className="bg-[#f5f0e8] dark:bg-gray-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-5xl mb-5" aria-hidden="true">🗺️</p>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a] dark:text-white sm:text-4xl">
            Plan Your Journey
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed text-base">
            View all destinations on an interactive map. Discover nearby spots,
            plan multi-stop itineraries, and navigate with ease across Eastern
            Visayas.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-12 shadow-md text-base"
          >
            <Link href="/map">Open Interactive Map</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
