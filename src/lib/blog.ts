import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export interface Post {
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

export function getAllPosts(lang: "pl" | "en" = "pl"): Post[] {
    const langDirectory = path.join(postsDirectory, lang);

    if (!fs.existsSync(langDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(langDirectory);
    const posts = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(langDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                lang,
                meta: data as Post["meta"],
                content,
            };
        });

    // Sort posts by date
    return posts.sort((a, b) => (new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()));
}

export function getPostBySlug(slug: string, lang: "pl" | "en" = "pl"): Post | null {
    const fullPath = path.join(postsDirectory, lang, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        lang,
        meta: data as Post["meta"],
        content,
    };
}
