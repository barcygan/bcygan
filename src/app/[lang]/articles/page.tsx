import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import { Section } from "@/components/Section";
import { getDictionary } from "@/get-dictionary";

export const metadata = {
    title: "Articles | Bartłomiej Cygan",
    description: "Profesjonalne artykuły branżowe, case studies, i poradniki.",
};

export default async function ArticlesIndex({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const articles = getAllArticles(lang as "pl" | "en");
    const dict = await getDictionary(lang as "pl" | "en");

    // We can fall back to blog dictionary keys if articles keys aren't defined yet
    // I will use dict.articles or default strings to prevent blowing up
    const title = (dict as any).articles?.title || (lang === "pl" ? "Artykuły Branżowe" : "Industry Articles");
    const subtitle = (dict as any).articles?.subtitle || (lang === "pl" ? "Profesjonalne case studies, analizy i strategie, którymi dzielę się z branżą." : "Professional case studies, analyses, and strategies I share with the industry.");
    const readMore = (dict as any).articles?.readMore || (lang === "pl" ? "Czytaj pełny artykuł" : "Read full article");
    const empty = (dict as any).articles?.empty || (lang === "pl" ? "Brak artykułów w tym języku." : "No articles found in this language.");

    return (
        <main className="min-h-screen pt-20">
            <Section title={title} subtitle={subtitle}>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <Link key={article.slug} href={`/${lang}/articles/${article.slug}`} className="group">
                                <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-4 text-sm text-muted-foreground">
                                            {new Date(article.meta.date).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <h2 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                                            {article.meta.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3">
                                            {article.meta.excerpt}
                                        </p>
                                        <div className="mt-auto pt-4 text-sm font-medium text-primary">
                                            {readMore} &rarr;
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-muted-foreground">{empty}</p>
                        </div>
                    )}
                </div>
            </Section>
        </main>
    );
}
