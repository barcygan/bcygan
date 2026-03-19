import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getDictionary } from "@/get-dictionary";

export async function generateStaticParams() {
    const params = [];
    for (const lang of ["pl", "en"] as const) {
        const posts = getAllPosts(lang);
        for (const post of posts) {
            params.push({ lang, slug: post.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const post = getPostBySlug(slug, lang as "pl" | "en");
    if (!post) return {};

    return {
        title: `${post.meta.title} | Bartłomiej Cygan`,
        description: post.meta.excerpt,
        openGraph: {
            title: post.meta.title,
            description: post.meta.excerpt,
            type: 'article',
            publishedTime: post.meta.date,
            authors: [post.meta.author],
        }
    };
}

export default async function BlogPost({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const post = getPostBySlug(slug, lang as "pl" | "en");
    const dict = await getDictionary(lang as "pl" | "en");

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-28 pb-20">
            <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <Link href={`/${lang}/blog`} className="mb-8 inline-block text-sm font-medium text-muted-foreground hover:text-primary">&larr; {dict.blog.back}</Link>

                <header className="mb-12">
                    <div className="mb-4 text-sm text-muted-foreground">
                        {new Date(post.meta.date).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })} &bull; {post.meta.author}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
                        {post.meta.title}
                    </h1>
                </header>

                <div className="prose prose-lg dark:prose-invert mx-auto prose-blue prose-headings:font-bold prose-headings:tracking-tighter">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
