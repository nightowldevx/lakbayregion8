'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAPLIBRE_STYLE, REGION8_CENTER, REGION8_ZOOM, extractCoordsFromEmbedUrl } from '@/lib/maplibre';
import type { Destination } from '@/types/destination';

interface MapViewProps {
    destinations: Destination[];
    className?: string;
    onMarkerClick?: (dest: Destination) => void;
    mapInstanceRef?: MutableRefObject<maplibregl.Map | null>;
    /** Active tile style URL — changes re-skin the map in place */
    styleUrl?: string;
}

export default function MapView({ destinations, className, onMarkerClick, mapInstanceRef, styleUrl }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: MAPLIBRE_STYLE,
            center: REGION8_CENTER,
            zoom: REGION8_ZOOM,
        });

        // Expose instance to parent for flyTo
        if (mapInstanceRef) mapInstanceRef.current = map.current;

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

        destinations.forEach((dest) => {
            // Popup HTML
            const popup = new maplibregl.Popup({ offset: 25, maxWidth: '240px' }).setHTML(`
        <div style="font-family:sans-serif;padding:6px 4px;min-width:160px">
          <strong style="font-size:14px;color:#111;display:block;margin-bottom:4px">${dest.name}</strong>
          <p style="margin:0 0 6px;font-size:12px;color:#555">${dest.province} · ${dest.category}</p>
          <a href="/destinations/${dest.slug}"
             style="font-size:12px;color:#16a34a;font-weight:600;text-decoration:underline">
            View Details →
          </a>
        </div>
      `);

            // Outer wrapper: owns the stable hit-box and hover listeners.
            // Never transforms itself, so mouseenter/mouseleave never flicker.
            const wrapper = document.createElement('div');
            wrapper.setAttribute('aria-label', dest.name);
            wrapper.style.cssText = `
              width: 32px;
              height: 32px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            `;

            // Inner teardrop: purely visual, pointer-events:none so it doesn't
            // interfere with the wrapper's stable hover zone.
            const pin = document.createElement('div');
            pin.style.cssText = `
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              background: #16a34a;
              transform: rotate(-45deg) scale(1);
              border: 2px solid #fff;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              pointer-events: none;
              transition: transform 150ms ease, box-shadow 150ms ease;
            `;
            wrapper.appendChild(pin);

            // Hover on wrapper (stable zone) → animate inner pin only
            wrapper.addEventListener('mouseenter', () => {
                pin.style.transform = 'rotate(-45deg) scale(1.2)';
                pin.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            });
            wrapper.addEventListener('mouseleave', () => {
                pin.style.transform = 'rotate(-45deg) scale(1)';
                pin.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            });

            // Coords: embed URL first → DB lat/lng fallback → skip if neither available
            const embedCoords = extractCoordsFromEmbedUrl(dest.google_maps_link);
            const lngLat: [number, number] | null =
                embedCoords ??
                (dest.longitude != null && dest.latitude != null
                    ? [dest.longitude, dest.latitude]
                    : null);

            // Skip destinations with no resolvable coordinates
            if (!lngLat) return;

            new maplibregl.Marker({ element: wrapper })
                .setLngLat(lngLat)
                .setPopup(popup)
                .addTo(map.current!);

            // Sync sidebar via callback if provided
            if (onMarkerClick) {
                wrapper.addEventListener('click', () => onMarkerClick(dest));
            }
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
        // destinations array identity won't change between renders; intentional dep
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Style switching ────────────────────────────────────────────────────────
    // Runs whenever the parent changes styleUrl. Skips on first render (map init
    // already uses the correct style). Re-adds markers after styedata loads.
    useEffect(() => {
        if (!map.current || !styleUrl) return;
        if (map.current.getStyle()?.name === styleUrl) return;
        map.current.setStyle(styleUrl);
    }, [styleUrl]);

    return <div ref={mapContainer} className={className ?? 'h-full w-full'} />;
}
