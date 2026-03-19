import { getDictionary } from "@/get-dictionary";
import { Hero } from "@/components/Hero";
import { Expertise } from "@/components/Expertise";
import { Experience } from "@/components/Experience";
import { ContentCreator } from "@/components/ContentCreator";
import { AIConsultant } from "@/components/AIConsultant";
import { Contact } from "@/components/Contact";
import { Dictionary } from "@/lib/types";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict: Dictionary = await getDictionary(lang as "pl" | "en");

    return (
        <main className="flex min-h-screen flex-col">
            <Hero dict={dict} />
            <Expertise dict={dict} />
            <Experience />
            <ContentCreator dict={dict} />
            <AIConsultant dict={dict} />
            <Contact dict={dict} />
        </main>
    );
}
