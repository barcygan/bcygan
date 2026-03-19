import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Section } from "@/components/Section";
import { getDictionary } from "@/get-dictionary";

export const metadata = {
    title: "Blog | Bartłomiej Cygan",
    description: "Artykuły o analityce, e-commerce i sztucznej inteligencji.",
};

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const posts = getAllPosts(lang as "pl" | "en");
    const dict = await getDictionary(lang as "pl" | "en");

    return (
        <main className="min-h-screen pt-20">
            <Section title={dict.blog.title} subtitle={dict.blog.subtitle}>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group">
                                <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
                                    {/* Image placeholder if needed */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-4 text-sm text-muted-foreground">
                                            {new Date(post.meta.date).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <h2 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                                            {post.meta.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3">
                                            {post.meta.excerpt}
                                        </p>
                                        <div className="mt-auto pt-4 text-sm font-medium text-primary">
                                            {dict.blog.readMore} &rarr;
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-muted-foreground">{dict.blog.empty}</p>
                        </div>
                    )}
                </div>
            </Section>
        </main>
    );
}
