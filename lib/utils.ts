// /lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Convert any text to a URL-safe slug.
 * e.g. "Kalanggaman Island!" → "kalanggaman-island"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // strip special chars
        .replace(/[\s_]+/g, '-')    // spaces / underscores → hyphens
        .replace(/--+/g, '-')       // collapse consecutive hyphens
        .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}

/**
 * Format an entrance fee string.
 * Returns "Free" when the value is empty or falsy.
 */
export function formatFee(fee: string): string {
    return fee?.trim() || 'Free';
}

/**
 * Format an operating hours string.
 * Returns "Open daily" when the value is empty or falsy.
 */
export function formatHours(hours: string): string {
    return hours?.trim() || 'Open daily';
}
