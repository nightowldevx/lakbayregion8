'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ModeToggle';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Map', href: '/map' },
    { label: 'About', href: '/about' },
] as const;

const LOGO_TEXTS = [
    'Lakbay Region 8',
    'Explore Region 8',
    '지역 8 탐험',
    '探索區域 8',
    'Erkunden Sie Region 8',
    'исследовать регион 8',
    '地域8を探索する',
] as const;

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoIndex, setLogoIndex] = useState(0);
    const [flipClass, setFlipClass] = useState('');

    const isActive = (href: string) => pathname === href;

    useEffect(() => {
        const interval = setInterval(() => {
            // Flip out
            setFlipClass('logo-flip-out');
            setTimeout(() => {
                // Swap text at the midpoint (fully hidden)
                setLogoIndex((prev) => (prev + 1) % LOGO_TEXTS.length);
                setFlipClass('logo-flip-in');
                // Clear class once animation ends
                setTimeout(() => setFlipClass(''), 220);
            }, 220);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-900/95 dark:border-gray-800">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white min-w-0"
                    aria-label="Lakbay Region 8 – Home"
                >
                    <span aria-hidden="true" className="shrink-0">🗺️</span>
                    <span
                        className={cn('inline-block whitespace-nowrap overflow-hidden', flipClass)}
                        aria-live="off"
                    >
                        {LOGO_TEXTS[logoIndex]}
                    </span>
                </Link>

                {/* Desktop links + ModeToggle */}
                <div className="hidden items-center gap-1 md:flex">
                    <ul className="flex items-center gap-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <li key={href}>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={cn(
                                        'text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400',
                                        isActive(href) && 'text-green-600 font-semibold dark:text-green-400'
                                    )}
                                >
                                    <Link href={href}>{label}</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <div className="ml-2">
                        <ModeToggle />
                    </div>
                </div>

                {/* Mobile: ModeToggle + hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMobileOpen((prev) => !prev)}
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 md:hidden">
                    <ul className="flex flex-col px-4 py-2">
                        {NAV_LINKS.map(({ label, href }) => (
                            <li key={href}>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400',
                                        isActive(href) && 'text-green-600 font-semibold dark:text-green-400'
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Link href={href}>{label}</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
