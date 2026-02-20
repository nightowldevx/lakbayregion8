'use client';

import { cn } from '@/lib/utils';
import { MAP_STYLES } from '@/lib/maplibre';
import type { MapStyle } from '@/lib/maplibre';

interface MapStyleSwitcherProps {
    active: string;
    onChange: (style: MapStyle) => void;
}

export default function MapStyleSwitcher({ active, onChange }: MapStyleSwitcherProps) {
    return (
        /*
         * Mobile: sits above the "📍 Destinations" trigger (which is fixed bottom-6).
         *   bottom-20 leaves ~80px gap so they don't overlap.
         * Desktop (sm+): centered, closer to the bottom edge.
         * Horizontal scroll on very narrow screens so all pills stay accessible.
         */
        <div
            className={cn(
                'absolute left-1/2 -translate-x-1/2 z-10',
                'bottom-20 sm:bottom-6',
                'flex items-center gap-1 p-1 rounded-full',
                'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md',
                'shadow-lg border border-gray-200 dark:border-gray-700',
                'max-w-[calc(100vw-2rem)] overflow-x-auto'
            )}
            role="group"
            aria-label="Map style"
        >
            {MAP_STYLES.map((style) => {
                const isActive = active === style.id;
                return (
                    <button
                        key={style.id}
                        onClick={() => onChange(style)}
                        title={style.label}
                        aria-pressed={isActive}
                        className={cn(
                            'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                            isActive
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                    >
                        <span>{style.icon}</span>
                        {/* Show label on sm+ only to keep mobile bar compact */}
                        <span className="hidden sm:inline">{style.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
