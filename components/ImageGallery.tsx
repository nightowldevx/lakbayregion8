'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images: string[];
    altPrefix: string;
}

export default function ImageGallery({ images, altPrefix }: ImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const isOpen = lightboxIndex !== null;

    const prev = useCallback(() => {
        setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : 0));
    }, [images.length]);

    const next = useCallback(() => {
        setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0));
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, prev, next]);

    if (images.length === 0) return null;

    // Masonry-style: first image large (spans 2 cols on md+), rest smaller
    const [first, ...rest] = images;

    return (
        <>
            {/* Grid */}
            <div
                className={cn(
                    'grid gap-2',
                    images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
                )}
            >
                {/* Hero image — large, spans 2 cols */}
                <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className={cn(
                        'relative overflow-hidden rounded-lg group',
                        images.length > 1 ? 'col-span-2 md:col-span-2 row-span-2 h-64 md:h-80' : 'h-64 w-full'
                    )}
                    aria-label={`View ${altPrefix} image 1`}
                >
                    <Image
                        src={first}
                        alt={`${altPrefix} 1`}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </button>

                {/* Remaining images — smaller cells */}
                {rest.map((src, idx) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => setLightboxIndex(idx + 1)}
                        className="relative overflow-hidden rounded-lg group h-40 md:h-auto"
                        aria-label={`View ${altPrefix} image ${idx + 2}`}
                    >
                        <Image
                            src={src}
                            alt={`${altPrefix} ${idx + 2}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </button>
                ))}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setLightboxIndex(null); }}>
                <DialogContent
                    className="max-w-5xl w-full p-0 bg-black/95 border-0 [&>button]:hidden"
                    aria-describedby={undefined}
                >
                    <DialogTitle className="sr-only">
                        {altPrefix} — image {(lightboxIndex ?? 0) + 1} of {images.length}
                    </DialogTitle>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="size-5" />
                    </button>

                    {/* Image */}
                    <div className="relative w-full aspect-[16/9]">
                        {lightboxIndex !== null && (
                            <Image
                                src={images[lightboxIndex]}
                                alt={`${altPrefix} ${lightboxIndex + 1}`}
                                fill
                                sizes="100vw"
                                className="object-contain"
                                priority
                            />
                        )}
                    </div>

                    {/* Prev / Next / Counter */}
                    <div className="flex items-center justify-between px-4 py-3 bg-black/80">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prev}
                            disabled={images.length <= 1}
                            className="text-white hover:bg-white/10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="size-6" />
                        </Button>
                        <span className="text-sm text-white/70">
                            {(lightboxIndex ?? 0) + 1} / {images.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={next}
                            disabled={images.length <= 1}
                            className="text-white hover:bg-white/10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="size-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
