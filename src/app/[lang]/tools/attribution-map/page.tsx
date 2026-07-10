import type { Metadata } from "next";
import AttributionMapFull from "@/components/AttributionMapFull";

export async function generateStaticParams() {
    return [{ lang: "pl" }, { lang: "en" }];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const isPl = lang === "pl";

    const title = isPl
        ? "Interaktywna Mapa Atrybucji Mobilnej | GA4 vs MMP vs SKAdNetwork"
        : "Interactive Mobile Attribution Map | GA4 vs MMP vs SKAdNetwork";

    const description = isPl
        ? "Śledź dane kampanii UTM przez całą ścieżkę użytkownika — od kliknięcia reklamy Meta do konwersji w aplikacji. Porównaj co widzi GA4, MMP i SKAdNetwork na każdym etapie."
        : "Trace UTM campaign data through the full user journey — from a Meta ad click to in-app conversion. Compare what GA4, MMP and SKAdNetwork see at each stage.";

    const url = `https://bartekcygan.pl/${lang}/tools/attribution-map`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: {
                pl: "/pl/tools/attribution-map",
                en: "/en/tools/attribution-map",
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Bartłomiej Cygan",
            type: "website",
        },
    };
}

export default async function AttributionMapPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <AttributionMapFull lang={lang as "pl" | "en"} />
    );
}
