import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Clock, Ticket } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import ImageGallery from '@/components/ImageGallery';
import DestinationCard from '@/components/DestinationCard';
import { getAllDestinations, getDestinationBySlug, getDestinationsByProvince } from '@/lib/queries';
import { formatFee, formatHours } from '@/lib/utils';
import type { Category, DestinationImage } from '@/types/destination';

const CATEGORY_STYLES: Record<Category, string> = {
    Beach: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    Nature: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Heritage: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Adventure: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

// ── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
    const destinations = await getAllDestinations();
    return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const dest = await getDestinationBySlug(slug);
    if (!dest) return {};

    const description = dest.description.slice(0, 160);
    const ogImage =
        dest.destination_images[0]?.image_url ??
        `https://picsum.photos/seed/${dest.slug}/1200/600`;

    return {
        title: `${dest.name} – Lakbay Region 8`,
        description,
        openGraph: {
            title: `${dest.name} – Lakbay Region 8`,
            description,
            images: [{ url: ogImage, width: 1200, height: 600, alt: dest.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${dest.name} – Lakbay Region 8`,
            description,
            images: [ogImage],
        },
    };
}

// ── Image helpers ─────────────────────────────────────────────────────────────

function getHeroImage(slug: string, images: DestinationImage[]): { url: string; alt: string } {
    const hero = images.find((img) => img.is_hero) ?? images[0];
    return {
        url: hero?.image_url ?? `https://picsum.photos/seed/${slug}/1200/600`,
        alt: hero?.alt_text ?? `Hero photo of ${slug}`,
    };
}

function getGalleryImages(slug: string, images: DestinationImage[]): string[] {
    // Gallery = all non-hero images in sort_order; fall back to picsum if empty
    const gallery = images.filter((img) => !img.is_hero);
    if (gallery.length > 0) return gallery.map((img) => img.image_url);
    // Fallback: 4 deterministic picsum images
    return Array.from({ length: 4 }, (_, i) =>
        `https://picsum.photos/seed/${slug}-${i}/800/600`
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const dest = await getDestinationBySlug(slug);

    if (!dest) notFound();

    const relatedDests = await getDestinationsByProvince(dest.province, slug);

    const { url: heroImageUrl, alt: heroImageAlt } = getHeroImage(
        dest.slug,
        dest.destination_images
    );
    const galleryImages = getGalleryImages(
        dest.slug,
        dest.destination_images
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: dest.name,
        description: dest.description,
        address: {
            '@type': 'PostalAddress',
            addressRegion: dest.province,
            addressCountry: 'PH',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: dest.latitude,
            longitude: dest.longitude,
        },
    };

    return (
        <main className="min-h-screen">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden">
                <Image
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                {/* Gradient overlay — stronger at bottom on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Province + Category badges — top right */}
                <div className="absolute top-3 right-3 flex gap-1.5 sm:top-4 sm:right-4 sm:gap-2">
                    <Badge className="bg-white/90 text-gray-800 font-medium text-xs sm:text-sm">
                        {dest.province}
                    </Badge>
                    <Badge className={`${CATEGORY_STYLES[dest.category]} border-0 font-semibold text-xs sm:text-sm`}>
                        {dest.category}
                    </Badge>
                </div>

                {/* Destination name — bottom left */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <h1 className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-4xl lg:text-5xl leading-tight">
                        {dest.name}
                    </h1>
                    <p className="hidden sm:block mt-1 text-white/80 text-sm font-medium">{dest.province}</p>
                </div>
            </div>

            {/* ── Two-column body ───────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-10">

                    {/* ── Main content (2/3) ──────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
                            {dest.description.split('\n').map((para, i) => (
                                <p key={i} className="text-gray-700 dark:text-gray-300 text-justify leading-relaxed mb-3">
                                    {para}
                                </p>
                            ))}
                        </section>

                        {/* Image gallery */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Photos</h2>
                            <ImageGallery images={galleryImages} altPrefix={dest.name} />
                        </section>

                        {/* Travel tips */}
                        {dest.travel_tips && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <MapPin className="size-5 text-green-600 dark:text-green-400" />
                                    Travel Tips
                                </h2>
                                <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-justify text-gray-700 leading-relaxed dark:bg-green-950/40 dark:border-green-900/50 dark:text-gray-300">
                                    {dest.travel_tips}
                                </div>
                            </section>
                        )}

                        {/* Google Maps embed */}
                        {dest.google_maps_link && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
                                <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                    <iframe
                                        src={dest.google_maps_link.replace('/maps/', '/maps/embed/v1/').includes('embed')
                                            ? dest.google_maps_link
                                            : `https://maps.google.com/maps?q=${dest.latitude},${dest.longitude}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Map of ${dest.name}`}
                                    />
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ── Info card (1/3) — sticky on desktop ─────────────────── */}
                    <aside className="mt-10 lg:mt-0">
                        <Card className="lg:sticky lg:top-20 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
                                    Destination Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Entrance fee */}
                                <div className="flex items-start gap-3">
                                    <Ticket className="size-5 text-green-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Entrance Fee</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatFee(dest.entrance_fee)}</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-3">
                                    <Clock className="size-5 text-green-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Hours</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatHours(dest.hours)}</p>
                                    </div>
                                </div>

                                {/* Province */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="size-5 text-green-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Province</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{dest.province}</p>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="flex items-center gap-2 pt-1">
                                    <Badge className={`${CATEGORY_STYLES[dest.category]} border-0 font-semibold`}>
                                        {dest.category}
                                    </Badge>
                                </div>

                                {/* Get Directions CTA */}
                                {dest.google_maps_link && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    asChild
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold mt-2"
                                                >
                                                    <a
                                                        href={dest.google_maps_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MapPin className="size-4 mr-2" />
                                                        Get Directions
                                                    </a>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Opens Google Maps</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </CardContent>
                        </Card>
                    </aside>
                </div>

                {/* ── Related destinations ─────────────────────────────────────── */}
                {relatedDests.length > 0 && (
                    <section className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            More in {dest.province}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedDests.map((related) => (
                                <DestinationCard key={related.id} destination={related} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Back link */}
                <div className="mt-10">
                    <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                        <Link href="/">← Back to destinations</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
