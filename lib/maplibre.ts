// /lib/maplibre.ts
// MapLibre + OpenFreeMap constants — no API key required.

export const MAPLIBRE_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export const REGION8_CENTER: [number, number] = [125.0, 11.5]; // [lng, lat]

export const REGION8_ZOOM = 8;

export interface MapStyle {
    id: string;
    label: string;
    url: string;
    /** Emoji shown in the pill button */
    icon: string;
}

export const MAP_STYLES: MapStyle[] = [
    {
        id: 'street',
        label: 'Classic Street',
        url: 'https://tiles.openfreemap.org/styles/liberty',
        icon: '🗺️',
    },
    {
        id: 'dark',
        label: 'Midnight Dark',
        url: 'https://tiles.openfreemap.org/styles/dark',
        icon: '🌑',
    },
    {
        id: 'minimal',
        label: 'Minimal White',
        url: 'https://tiles.openfreemap.org/styles/bright',
        icon: '⬜',
    },
    {
        id: 'satellite',
        label: 'Satellite',
        url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        icon: '🛰️',
    },
];

/**
 * Extract [lng, lat] from a Google Maps embed URL.
 * Embed URLs encode coordinates in the pb= parameter as !2d<lng>!3d<lat>.
 * Returns null if the URL is not a recognisable embed URL.
 */
export function extractCoordsFromEmbedUrl(url?: string | null): [number, number] | null {
    if (!url) return null;
    try {
        const lngMatch = url.match(/!2d(-?\d+\.\d+)/);
        const latMatch = url.match(/!3d(-?\d+\.\d+)/);
        if (lngMatch && latMatch) {
            const lng = parseFloat(lngMatch[1]);
            const lat = parseFloat(latMatch[1]);
            // Sanity-check: Region 8 bounding box
            if (lat > 10 && lat < 13 && lng > 123 && lng < 126) {
                return [lng, lat];
            }
        }
    } catch {
        // fall through
    }
    return null;
}
