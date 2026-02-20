'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Destination } from '@/types/destination';

const CATEGORIES: Category[] = ['Beach', 'Nature', 'Heritage', 'Adventure'];

const CATEGORY_STYLES: Record<Category, { badge: string; header: string; icon: string }> = {
    Beach: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', header: 'hover:bg-blue-50 dark:hover:bg-blue-950/40', icon: '🏖️' },
    Nature: { badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', header: 'hover:bg-green-50 dark:hover:bg-green-950/40', icon: '🌿' },
    Heritage: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', header: 'hover:bg-amber-50 dark:hover:bg-amber-950/40', icon: '🏛️' },
    Adventure: { badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', header: 'hover:bg-red-50 dark:hover:bg-red-950/40', icon: '🧗' },
};

interface MapSidebarProps {
    destinations: Destination[];
    activeSlug?: string;
    onSelect: (dest: Destination) => void;
}

export default function MapSidebar({ destinations, activeSlug, onSelect }: MapSidebarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    // All categories start expanded
    const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(
        new Set(CATEGORIES)
    );

    function toggleCategory(cat: Category) {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            next.has(cat) ? next.delete(cat) : next.add(cat);
            return next;
        });
    }

    function handleSelect(dest: Destination) {
        onSelect(dest);
        setSheetOpen(false);
    }

    // Group destinations by category, preserving CATEGORIES order
    const grouped = CATEGORIES.map((cat) => ({
        category: cat,
        items: destinations.filter((d) => d.category === cat),
    }));

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            {/* Trigger — fixed bottom-left mobile / vertically centred left on desktop */}
            <SheetTrigger asChild>
                <Button
                    className={cn(
                        'fixed z-20 shadow-lg font-semibold',
                        'bottom-6 left-4 sm:bottom-auto',
                        'sm:top-1/2 sm:-translate-y-1/2 sm:left-4',
                        'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
                    )}
                    variant="outline"
                    size="sm"
                    aria-label="Open destinations list"
                >
                    📍 Destinations
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-80 p-0 flex flex-col overflow-hidden [&>button]:hidden">
                <SheetHeader className="px-4 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <SheetTitle className="text-base font-bold">
                        📍 {destinations.length} Destinations
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 h-0 min-h-0">
                    <div className="pb-4">
                        {grouped.map(({ category, items }) => {
                            const isExpanded = expandedCategories.has(category);
                            const styles = CATEGORY_STYLES[category];

                            return (
                                <div key={category}>
                                    {/* Category header — click to toggle */}
                                    <button
                                        type="button"
                                        onClick={() => toggleCategory(category)}
                                        aria-expanded={isExpanded}
                                        className={cn(
                                            'w-full flex items-center justify-between px-4 py-3',
                                            'border-b border-gray-100 dark:border-gray-700 transition-colors duration-150',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600',
                                            styles.header
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span aria-hidden="true">{styles.icon}</span>
                                            <Badge className={cn('border-0 text-xs font-semibold', styles.badge)}>
                                                {category}
                                            </Badge>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                                                {items.length}
                                            </span>
                                        </div>
                                        {isExpanded
                                            ? <ChevronDown className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                            : <ChevronRight className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                        }
                                    </button>

                                    {/* Collapsible destination list */}
                                    {isExpanded && (
                                        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {items.map((dest) => {
                                                const isActive = dest.slug === activeSlug;
                                                return (
                                                    <li key={dest.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelect(dest)}
                                                            className={cn(
                                                                'w-full text-left pl-8 pr-4 py-2.5 transition-colors duration-150',
                                                                'hover:bg-green-50 dark:hover:bg-green-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600',
                                                                isActive && 'bg-green-50 dark:bg-green-950/40 border-l-2 border-green-600 dark:border-green-500'
                                                            )}
                                                        >
                                                            <p className={cn(
                                                                'text-sm leading-snug font-medium',
                                                                isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'
                                                            )}>
                                                                {dest.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-250 mt-0.5">
                                                                {dest.province}
                                                            </p>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
