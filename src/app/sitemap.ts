import { MetadataRoute } from 'next';

const MAX_POSTS = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // In a real scenario, fetch blog posts here to add dynamic routes
    // For now, static routes

    return [
        {
            url: 'https://bartekcygan.pl',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://bartekcygan.pl/blog',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://bartekcygan.pl/articles',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://bartekcygan.pl/#expertise',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://bartekcygan.pl/#contact',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
