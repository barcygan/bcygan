import { AppAnalyticsLP } from "@/components/AppAnalyticsLP";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isPl = lang === "pl";
    
    return {
        title: isPl 
            ? "Specjalista ds. Analityki w Aplikacji | Bartłomiej Cygan" 
            : "Mobile App Analytics Specialist | Bartłomiej Cygan",
        description: isPl 
            ? "Szukasz specjalisty ds. analityki w aplikacji? Wdrażam systemy Firebase, Amplitude, GA4, BigQuery dla e-commerce i subskrypcji. Zwiększ LTV i retencję na bazie danych." 
            : "Looking for an in-app analytics specialist? I implement Firebase, Amplitude, GA4, and BigQuery tracking for e-commerce and subscription apps.",
        alternates: {
            canonical: `https://bartekcygan.pl/${lang}/analityka-w-aplikacji`,
            languages: {
                'en': '/en/analityka-w-aplikacji',
                'pl': '/pl/analityka-w-aplikacji',
            },
        },
        openGraph: {
            title: isPl 
                ? "Specjalista ds. Analityki w Aplikacji | Bartłomiej Cygan" 
                : "Mobile App Analytics Specialist | Bartłomiej Cygan",
            description: isPl 
                ? "Wdrażam systemy Firebase, Amplitude, GA4, BigQuery dla e-commerce i subskrypcji mobilnych." 
                : "I implement Firebase, Amplitude, GA4, and BigQuery tracking for e-commerce and subscription-based mobile apps.",
            url: `https://bartekcygan.pl/${lang}/analityka-w-aplikacji`,
            siteName: 'Bartłomiej Cygan',
            locale: isPl ? 'pl_PL' : 'en_US',
            type: 'website',
        },
    };
}

export default async function AnalyticsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <AppAnalyticsLP lang={lang} />;
}
