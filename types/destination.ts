// /types/destination.ts
// Shared TypeScript interfaces — import from here everywhere, never redefine.

export type Province =
    | 'Leyte'
    | 'Southern Leyte'
    | 'Eastern Samar'
    | 'Northern Samar'
    | 'Western Samar'
    | 'Biliran';

export type Category = 'Beach' | 'Nature' | 'Heritage' | 'Adventure';

export interface Destination {
    id: string;               // uuid
    name: string;
    slug: string;             // url-safe, unique
    province: Province;
    category: Category;
    description: string;
    entrance_fee: string;     // e.g. "₱50" | "Free"
    hours: string;            // e.g. "6:00 AM – 6:00 PM"
    latitude?: number;
    longitude?: number;
    google_maps_link: string;
    travel_tips: string;
    created_at: string;       // ISO timestamp
}

export interface DestinationImage {
    id: string;
    destination_id: string;
    image_url: string;        // Supabase public storage URL
    is_hero: boolean;
    sort_order: number;
    alt_text: string | null;
    created_at: string;
}

export interface DestinationWithImages extends Destination {
    destination_images: DestinationImage[];
}
