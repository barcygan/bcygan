import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "src/content/articles");

export interface Article {
    slug: string;
    lang: string;
    meta: {
        title: string;
        excerpt: string;
        date: string;
        author: string;
        coverImage?: string;
    };
    content: string;
}

export function getAllArticles(lang: "pl" | "en" = "pl"): Article[] {
    const langDirectory = path.join(articlesDirectory, lang);

    if (!fs.existsSync(langDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(langDirectory);
    const articles = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(langDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                lang,
                meta: data as Article["meta"],
                content,
            };
        });

    // Sort articles by date
    return articles.sort((a, b) => (new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()));
}

export function getArticleBySlug(slug: string, lang: "pl" | "en" = "pl"): Article | null {
    const fullPath = path.join(articlesDirectory, lang, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        lang,
        meta: data as Article["meta"],
        content,
    };
}
