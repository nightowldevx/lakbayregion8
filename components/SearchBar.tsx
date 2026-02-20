'use client';

import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [, startTransition] = useTransition();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        startTransition(() => {
            onSearch(value);
        });
    }

    return (
        <div className="relative w-full">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500 pointer-events-none"
                aria-hidden="true"
            />
            <Input
                type="search"
                placeholder="Search destinations or provinces…"
                aria-label="Search destinations"
                onChange={handleChange}
                className="pl-9 h-10"
            />
        </div>
    );
}
