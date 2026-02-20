import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Map', href: '/map' },
    { label: 'About', href: '#about' },
] as const;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Top row */}
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Brand */}
                    <div>
                        <p className="flex items-center gap-2 text-lg font-bold">
                            <span aria-hidden="true">🗺️</span>
                            Lakbay Region 8
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            Discover the beauty of Eastern Visayas
                        </p>
                    </div>

                    {/* Quick links */}
                    <nav aria-label="Footer navigation">
                        <ul className="flex items-center gap-1">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="text-gray-300 hover:text-white px-2 h-auto py-0"
                                    >
                                        <Link href={href}>{label}</Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <Separator className="my-6 bg-gray-700" />

                {/* Copyright */}
                <p className="text-center text-xs text-gray-500">
                    © {year} Lakbay Region 8. Built for the people of Region 8.
                </p>
            </div>
        </footer>
    );
}
