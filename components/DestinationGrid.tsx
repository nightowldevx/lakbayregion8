'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import DestinationCard from './DestinationCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Province, DestinationWithImages } from '@/types/destination';

const PROVINCES: Province[] = [
    'Leyte',
    'Southern Leyte',
    'Eastern Samar',
    'Northern Samar',
    'Western Samar',
    'Biliran',
];

interface DestinationGridProps {
    destinations: DestinationWithImages[];
}

export default function DestinationGrid({ destinations }: DestinationGridProps) {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [activeProvince, setActiveProvince] = useState<Province | ''>('');

    const filtered = destinations.filter((d) => {
        const matchesQuery =
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.province.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory ? d.category === activeCategory : true;
        const matchesProvince = activeProvince ? d.province === activeProvince : true;
        return matchesQuery && matchesCategory && matchesProvince;
    });

    return (
        <section id="destinations" className="space-y-5">
            {/* ── Filter bar ───────────────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 flex flex-col gap-3 dark:bg-gray-800 dark:border-gray-700">
                {/* Row 1: search + province */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <SearchBar onSearch={setQuery} />
                    </div>
                    <Select
                        value={activeProvince}
                        onValueChange={(val) =>
                            setActiveProvince(val === 'all' ? '' : (val as Province))
                        }
                    >
                        <SelectTrigger
                            className="w-full sm:w-44 shrink-0 bg-white dark:bg-gray-800"
                            aria-label="Filter by province"
                        >
                            <SelectValue placeholder="All Provinces" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Provinces</SelectItem>
                            {PROVINCES.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-700" />

                {/* Row 2: category pills */}
                <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
            </div>

            {/* ── Results ─────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-900/50 dark:bg-yellow-950/30">
                    <p className="font-medium text-yellow-800 dark:text-yellow-300">No destinations found.</p>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                        Try a different search term or clear the filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((dest) => (
                        <DestinationCard key={dest.id} destination={dest} />
                    ))}
                </div>
            )}
        </section>
    );
}
