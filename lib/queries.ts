// /lib/queries.ts
// All DB access goes through here. Never call supabase directly inside components.

import { createServerClient } from './supabase';
import type { DestinationWithImages } from '@/types/destination';

/**
 * Strip control characters, trim whitespace, and cap length.
 * Applied to all user-supplied search strings before they reach the DB.
 */
function sanitizeSearch(raw: string): string {
    return raw
        // Remove ASCII/Unicode control characters
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .trim()
        .slice(0, 100);
}

export async function getAllDestinations(): Promise<DestinationWithImages[]> {
    const sb = createServerClient();
    const { data, error } = await sb
        .from('destinations')
        .select('*, destination_images(*)')
        .order('name')
        .order('sort_order', { referencedTable: 'destination_images' });
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getDestinationBySlug(
    slug: string
): Promise<DestinationWithImages | null> {
    const sb = createServerClient();
    const { data, error } = await sb
        .from('destinations')
        .select('*, destination_images(*)')
        .eq('slug', slug)
        .order('sort_order', { referencedTable: 'destination_images' })
        .single();
    if (error) return null;
    return data;
}

export async function searchDestinations(
    query: string,
    province?: string,
    category?: string
): Promise<DestinationWithImages[]> {
    const sb = createServerClient();
    let req = sb
        .from('destinations')
        .select('*, destination_images(*)')
        .order('name')
        .order('sort_order', { referencedTable: 'destination_images' });

    const clean = sanitizeSearch(query);
    if (clean) req = req.ilike('name', `%${clean}%`);
    if (province) req = req.eq('province', province);
    if (category) req = req.eq('category', category);

    const { data, error } = await req;
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getDestinationsByProvince(
    province: string,
    excludeSlug: string
): Promise<DestinationWithImages[]> {
    const sb = createServerClient();
    const { data, error } = await sb
        .from('destinations')
        .select('*, destination_images(*)')
        .eq('province', province)
        .neq('slug', excludeSlug)
        .order('sort_order', { referencedTable: 'destination_images' })
        .limit(3);
    if (error) return [];
    return data ?? [];
}
