import { getAllDestinations } from '@/lib/queries';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://lakbayregion8.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const destinations = await getAllDestinations();

    const destinationEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
        url: `${BASE_URL}/destinations/${d.slug}`,
        lastModified: d.created_at ? new Date(d.created_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/map`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...destinationEntries,
    ];
}
