import type { Metadata } from 'next';
import { getAllDestinations } from '@/lib/queries';
import MapClient from './MapClient';

export const metadata: Metadata = {
    title: 'Interactive Map – Lakbay Region 8',
    description:
        'Explore all Eastern Visayas destinations on an interactive map. Find beaches, heritage sites, nature trails, and adventures across Region 8.',
};

export default async function MapPage() {
    const destinations = await getAllDestinations();

    return (
        <main>
            <MapClient destinations={destinations} />
        </main>
    );
}
