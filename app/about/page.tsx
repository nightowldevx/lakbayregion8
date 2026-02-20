import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Compass, Users, Leaf } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About',
    description:
        'Learn about Lakbay Region 8 — a curated tourism guide to Eastern Visayas covering 21 destinations across Leyte, Samar, and Biliran.',
};

const PROVINCES = [
    {
        name: 'Leyte',
        capital: 'Tacloban City',
        highlights: 'Historical landmarks, WWII sites, and lush highland waterfalls.',
        emoji: '🏛️',
        color: 'border-amber-400 dark:border-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
        name: 'Southern Leyte',
        capital: 'Maasin City',
        highlights: 'Pristine dive sites, marine sanctuaries, and whale shark encounters.',
        emoji: '🐋',
        color: 'border-blue-400 dark:border-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
        name: 'Eastern Samar',
        capital: 'Borongan City',
        highlights: 'Rugged coastline, river canyons, and surfer-friendly waves.',
        emoji: '🏄',
        color: 'border-cyan-400 dark:border-cyan-600',
        bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    },
    {
        name: 'Northern Samar',
        capital: 'Catarman',
        highlights: 'Remote island-hopping, pristine beaches, and untouched nature.',
        emoji: '🏝️',
        color: 'border-green-400 dark:border-green-600',
        bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
        name: 'Western Samar',
        capital: 'Catbalogan City',
        highlights: 'Ancient rock formations, waterfalls, and scenic mountain ranges.',
        emoji: '⛰️',
        color: 'border-emerald-400 dark:border-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
        name: 'Biliran',
        capital: 'Naval',
        highlights: 'Cascading hot springs, volcanic craters, and island adventure.',
        emoji: '🌋',
        color: 'border-red-400 dark:border-red-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
    },
] as const;

const PILLARS = [
    {
        icon: Compass,
        title: 'Curated Discovery',
        body: 'Every destination is hand-picked for its authenticity, accessibility, and cultural or natural value - no fluff, just real gems.',
    },
    {
        icon: MapPin,
        title: 'Interactive Map',
        body: 'Explore all 21 destinations spatially on an interactive map powered by OpenFreeMap - plan routes and discover what\'s nearby.',
    },
    {
        icon: Leaf,
        title: 'Responsible Tourism',
        body: 'We highlight entrance fees, hours, and travel tips to help visitors be respectful guests to the communities they visit.',
    },
    {
        icon: Users,
        title: 'Built for Everyone',
        body: 'Whether you\'re a backpacker, a family, or a heritage enthusiast - there\'s a corner of Eastern Visayas for you.',
    },
] as const;

const STATS = [
    { value: '21', label: 'Destinations' },
    { value: '6', label: 'Provinces' },
    { value: '4', label: 'Categories' },
    { value: '1', label: 'Region' },
] as const;

export default function AboutPage() {
    return (
        <main className="min-h-screen">

            {/*  Hero */}
            <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
                <Image
                    src="https://picsum.photos/seed/region8-about/1600/900"
                    alt="Scenic view of Eastern Visayas"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
                        Lakbay Region 8
                    </p>
                    <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        About This Guide
                    </h1>
                    <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
                        A passion project dedicated to uncovering the extraordinary beauty
                        of Eastern Visayas - one destination at a time.
                    </p>
                </div>
            </section>

            {/*  Stats bar*/}
            <section className="bg-[#f5f0e8] dark:bg-gray-900 border-b border-[#e8ddc8] dark:border-gray-800">
                <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                    <div className="flex items-stretch justify-center divide-x divide-[#d4c9b0] dark:divide-gray-700">
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="flex flex-1 flex-col items-center gap-1 px-4 py-3 text-center">
                                <span className="text-4xl font-black text-green-700 dark:text-green-400 leading-none">
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

            {/*  Mission */}
            <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display text-3xl font-bold text-[#1a1a1a] dark:text-white sm:text-4xl">
                        Why Lakbay Region 8?
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Eastern Visayas is often overlooked in favour of more prominent Philippine
                        destinations. This guide exists to change that - by making Region 8's
                        wonders discoverable, accessible, and impossible to ignore.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {PILLARS.map(({ icon: Icon, title, body }) => (
                        <div
                            key={title}
                            className="flex gap-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-6 shadow-sm"
                        >
                            <div className="shrink-0 mt-0.5">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                                    <Icon className="size-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Separator className="dark:bg-gray-800" />

            {/* Provinces*/}
            <section className="bg-[#f5f0e8] dark:bg-gray-900 py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-[#1a1a1a] dark:text-white sm:text-4xl">
                            The 6 Provinces of Region 8
                        </h2>
                        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            Each province brings its own flavour of adventure, culture, and natural wonder.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {PROVINCES.map(({ name, capital, highlights, emoji, color, bg }) => (
                            <div
                                key={name}
                                className={`rounded-xl border-l-4 ${color} ${bg} p-5 shadow-sm`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{capital}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {highlights}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*  About the project */}
            <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-green-100 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 p-8 sm:p-10 text-center">
                    <span className="text-4xl mb-4 block" aria-hidden="true">🌿</span>
                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        About the Project
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
                        <span className="font-semibold text-green-700 dark:text-green-400">Lakbay Region 8</span> is
                        an open-source tourism guide built with Next.js, Supabase, and OpenFreeMap.
                        It was created as a portfolio project with the goal of showcasing Region 8's
                        destinations in a clean, modern, and accessible web experience.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                        All destination data - including descriptions, coordinates, entrance fees,
                        and hours - was compiled from publicly available sources and local tourism
                        boards. This project is not affiliated with any government agency.
                    </p>
                </div>
            </section>

            {/*  CTA  */}
            <section className="bg-[#f5f0e8] dark:bg-gray-900 py-20">
                <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="font-display text-3xl font-bold text-[#1a1a1a] dark:text-white sm:text-4xl">
                        Ready to Explore?
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                        Browse all 21 destinations or open the interactive map to plan your journey.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 shadow-md"
                        >
                            <Link href="/#destinations">Browse Destinations</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-gray-300 dark:border-gray-600 font-semibold dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <Link href="/map">
                                <MapPin className="size-4 mr-2" />
                                Open Map
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

        </main>
    );
}
