'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/destination';

const CATEGORIES: Category[] = ['Beach', 'Nature', 'Heritage', 'Adventure'];

const ACTIVE_STYLES: Record<Category, string> = {
    Beach: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900',
    Nature: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/60 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900',
    Heritage: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900',
    Adventure: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/60 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900',
};

const INACTIVE_STYLE =
    'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white';

interface CategoryFilterProps {
    active: Category | null;
    onChange: (category: Category | null) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
    function handleClick(category: Category) {
        onChange(active === category ? null : category);
    }

    return (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => {
                const isActive = active === cat;
                return (
                    <button
                        key={cat}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleClick(cat)}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-full"
                    >
                        <Badge
                            className={cn(
                                'cursor-pointer select-none rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150',
                                isActive ? ACTIVE_STYLES[cat] : INACTIVE_STYLE
                            )}
                        >
                            {cat}
                        </Badge>
                    </button>
                );
            })}
        </div>
    );
}
