'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MapSidebar from '@/components/MapSidebar';
import MapStyleSwitcher from '@/components/MapStyleSwitcher';
import { extractCoordsFromEmbedUrl, MAP_STYLES } from '@/lib/maplibre';
import type { MapStyle } from '@/lib/maplibre';
import type { Destination } from '@/types/destination';
import type maplibregl from 'maplibre-gl';

// MapView MUST always be a dynamic import with ssr:false (SKILL.md requirement)
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface MapClientProps {
    destinations: Destination[];
}

export default function MapClient({ destinations }: MapClientProps) {
    const [activeSlug, setActiveSlug] = useState<string | undefined>();
    const [activeStyle, setActiveStyle] = useState<MapStyle>(MAP_STYLES[0]);
    // maplibre map instance forwarded via a callback ref from MapView
    const mapRef = useRef<maplibregl.Map | null>(null);

    const handleSelect = useCallback((dest: Destination) => {
        setActiveSlug(dest.slug);
        if (mapRef.current) {
            // Coords: embed URL first → DB lat/lng → skip flyTo if neither available
            const lngLat: [number, number] | null =
                extractCoordsFromEmbedUrl(dest.google_maps_link) ??
                (dest.longitude != null && dest.latitude != null
                    ? [dest.longitude, dest.latitude]
                    : null);

            if (!lngLat) return;

            mapRef.current.flyTo({
                center: lngLat,
                zoom: 13,
                speed: 1.4,
                curve: 1.2,
            });
        }
    }, []);

    const handleMarkerClick = useCallback((dest: Destination) => {
        setActiveSlug(dest.slug);
    }, []);

    const handleStyleChange = useCallback((style: MapStyle) => {
        setActiveStyle(style);
    }, []);

    return (
        <div className="relative h-[calc(100vh-64px)] w-full">
            <MapView
                destinations={destinations}
                className="h-full w-full"
                onMarkerClick={handleMarkerClick}
                mapInstanceRef={mapRef}
                styleUrl={activeStyle.url}
            />
            <MapSidebar
                destinations={destinations}
                activeSlug={activeSlug}
                onSelect={handleSelect}
            />
            {/* Style switcher — floating pill bar at the bottom-center */}
            <MapStyleSwitcher
                active={activeStyle.id}
                onChange={handleStyleChange}
            />
        </div>
    );
}
