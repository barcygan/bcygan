import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getDictionary } from "@/get-dictionary";
import Script from 'next/script';
import { FAQAccordion } from "@/components/FAQAccordion";

export async function generateStaticParams() {
    const params = [];
    for (const lang of ["pl", "en"] as const) {
        const articles = getAllArticles(lang);
        for (const article of articles) {
            params.push({ lang, slug: article.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const article = getArticleBySlug(slug, lang as "pl" | "en");
    if (!article) return {};

    const url = `https://bartekcygan.pl/${lang}/articles/${slug}`;

    return {
        title: `${article.meta.title} | Bartłomiej Cygan`,
        description: article.meta.excerpt,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: article.meta.title,
            description: article.meta.excerpt,
            type: 'article',
            url: url,
            publishedTime: article.meta.date,
            authors: [article.meta.author],
        }
    };
}

export default async function ArticlePost({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const article = getArticleBySlug(slug, lang as "pl" | "en");
    const dict = await getDictionary(lang as "pl" | "en");

    if (!article) {
        notFound();
    }

    const backText = (dict as any).articles?.back || (lang === "pl" ? "Wróć do artykułów" : "Back to articles");
    
    // JSON-LD Generation
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.meta.title,
        description: article.meta.excerpt,
        author: [{
            '@type': 'Person',
            name: article.meta.author,
            url: 'https://bartekcygan.pl'
        }],
        datePublished: article.meta.date,
        url: `https://bartekcygan.pl/${lang}/articles/${slug}`
    };

    // Extract basic FAQs if they exist in the markdown. 
    // This is a simple heuristic based on the structure introduced.
    const faqs: { question: string, answer: string }[] = [];
    if (article.content.includes("### Często Zadawane Pytania") || article.content.includes("### Frequently Asked Questions")) {
        const lines = article.content.split('\n');
        let currentQuestion = "";
        let currentAnswer = "";
        let capturingFaqs = false;

        for (const line of lines) {
            if (line.includes("### Często Zadawane") || line.includes("### Frequently")) {
                capturingFaqs = true;
                continue;
            }
            if (capturingFaqs) {
                if (line.startsWith("**") && line.endsWith("**")) {
                    if (currentQuestion && currentAnswer) {
                        faqs.push({ question: currentQuestion.replace(/\*\*/g, '').trim(), answer: currentAnswer.trim() });
                    }
                    currentQuestion = line.replace(/\*\*/g, '').trim();
                    currentAnswer = "";
                } else if (line.trim() !== "" && !line.startsWith("###")) {
                    currentAnswer += line + " ";
                }
            }
        }
        if (currentQuestion && currentAnswer) {
            faqs.push({ question: currentQuestion.replace(/\*\*/g, '').trim(), answer: currentAnswer.trim() });
        }
    }

    let markdownContent = article.content;
    const faqTitleMarker = 
        article.content.includes("### Często Zadawane") ? "### Często Zadawane Pytania (FAQ)" :
        (article.content.includes("### Frequently Asked") ? "### Frequently Asked Questions (AI & SEO Optimized)" : null);

    const faqTitle = article.content.includes("### Często Zadawane") ? "Często Zadawane Pytania (FAQ)" : "Frequently Asked Questions (AI & SEO Optimized)";

    if (faqTitleMarker && article.content.includes(faqTitleMarker)) {
        markdownContent = article.content.split(faqTitleMarker)[0].replace(/<hr \/>\s*$/, "");
    } else if (article.content.includes("### Często Zadawane Pytania")) {
        markdownContent = article.content.split("### Często Zadawane Pytania")[0].replace(/<hr \/>\s*$/, "");
    }

    const faqSchema = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    } : null;

    return (
        <main className="min-h-screen pt-28 pb-20 relative">
            <Script
                id={`article-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <Script
                    id={`faq-schema-${slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            
            <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
                <Link href={`/${lang}/articles`} className="mb-8 inline-block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    &larr; {backText}
                </Link>

                <header className="mb-12">
                    <div className="mb-4 text-sm text-primary font-medium tracking-wider">
                        {new Date(article.meta.date).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })} &bull; {article.meta.author}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1] mb-6">
                        {article.meta.title}
                    </h1>
                    <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
                        {article.meta.excerpt}
                    </p>
                </header>

                <div className="divider-accent mb-12"></div>

                <div className="prose prose-lg prose-invert mx-auto prose-blue prose-headings:font-bold prose-headings:tracking-tighter">
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>

                {faqs.length > 0 && (
                    <FAQAccordion faqs={faqs} title={faqTitle} />
                )}
            </article>
        </main>
    );
}
