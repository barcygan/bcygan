import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bartekcygan.pl';
    const locales = ['pl', 'en'] as const;

    const routes: MetadataRoute.Sitemap = [];

    // Base pages for each locale
    for (const lang of locales) {
        routes.push(
            {
                url: `${baseUrl}/${lang}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/${lang}/blog`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${lang}/articles`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }
        );

        // Dynamic articles
        const articles = getAllArticles(lang);
        for (const article of articles) {
            routes.push({
                url: `${baseUrl}/${lang}/articles/${article.slug}`,
                lastModified: new Date(article.meta.date),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        }

        // Dynamic blog posts
        const posts = getAllPosts(lang);
        for (const post of posts) {
            routes.push({
                url: `${baseUrl}/${lang}/blog/${post.slug}`,
                lastModified: new Date(post.meta.date),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        }
    }

    return routes;
}
