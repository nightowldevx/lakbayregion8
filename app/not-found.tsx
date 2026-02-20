'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query.trim())}`);
        }
    }

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4 text-center">
            {/* Friendly illustration */}
            <span className="text-8xl select-none" aria-hidden="true">🗺️</span>

            {/* Alert */}
            <Alert className="max-w-md border-amber-200 bg-amber-50 text-left">
                <AlertTitle className="text-amber-800 font-bold text-base">
                    Destination not found
                </AlertTitle>
                <AlertDescription className="text-amber-700 mt-1">
                    We couldn&apos;t find that page. It may have been moved or the URL
                    might be incorrect. Try searching below or browse all destinations
                    on the home page.
                </AlertDescription>
            </Alert>

            {/* Inline search */}
            <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
                        aria-hidden="true"
                    />
                    <Input
                        type="search"
                        placeholder="Search destinations…"
                        aria-label="Search destinations"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Search
                </Button>
            </form>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8">
                    <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild variant="outline" className="px-8">
                    <Link href="/map">View Map</Link>
                </Button>
            </div>
        </div>
    );
}
