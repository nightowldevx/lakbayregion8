import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DestinationWithImages } from '@/types/destination';
import type { Category } from '@/types/destination';

interface DestinationCardProps {
    destination: DestinationWithImages;
}

const CATEGORY_STYLES: Record<Category, string> = {
    Beach: 'bg-blue-500/90 text-white',
    Nature: 'bg-green-600/90 text-white',
    Heritage: 'bg-amber-600/90 text-white',
    Adventure: 'bg-red-600/90 text-white',
};

export default function DestinationCard({ destination }: DestinationCardProps) {
    const { name, slug, province, category, destination_images } = destination;
    // Prefer the row flagged as hero image, then sort_order[0], then picsum fallback
    const heroImg =
        destination_images.find((img) => img.is_hero) ??
        destination_images[0];
    const coverImage = heroImg?.image_url ?? `https://picsum.photos/seed/${slug}/800/600`;
    const coverAlt = heroImg?.alt_text ?? `Photo of ${name}`;

    return (
        <Link
            href={`/destinations/${slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-2xl"
        >
            {/* Card: full-bleed landscape image with overlay */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md">
                {/* Background image */}
                <Image
                    src={coverImage}
                    alt={coverAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay — darkens on hover */}
                <div className={cn(
                    'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0',
                    'transition-all duration-300 group-hover:from-black/90 group-hover:via-black/30'
                )} />

                {/* Category badge — top right */}
                <div className="absolute top-3 right-3">
                    <Badge className={cn('border-0 text-xs font-semibold shadow', CATEGORY_STYLES[category])}>
                        {category}
                    </Badge>
                </div>

                {/* Text overlay — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-lg font-bold leading-snug text-white drop-shadow-sm">
                        {name}
                    </h3>
                    <p className="mt-0.5 text-sm text-white/70 font-medium">
                        {province}
                    </p>
                </div>
            </div>
        </Link>
    );
}
