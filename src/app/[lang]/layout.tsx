import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";
import { clsx } from "clsx";
import { getDictionary } from "@/get-dictionary";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Bartłomiej (skidoctor) Cygan | Digital Expert & Content Creator",
    description: "Digital Analytics Business Partner @ Decathlon CEE. E-commerce strategist, AI consultant, ski instructor and content creator.",
    alternates: {
        canonical: 'https://bartekcygan.pl',
        languages: {
            'en': '/en',
            'pl': '/pl',
        },
    },
    openGraph: {
        title: 'Bartłomiej (skidoctor) Cygan | Digital Expert & Content Creator',
        description: 'Digital Analytics Business Partner @ Decathlon CEE. E-commerce strategist, AI consultant, ski instructor and content creator.',
        url: 'https://bartekcygan.pl',
        siteName: 'Bartłomiej Cygan',
        locale: 'pl_PL',
        type: 'website',
    },
};

export async function generateStaticParams() {
    return [{ lang: "pl" }, { lang: "en" }];
}

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "pl" | "en");

    return (
        <html lang={lang} className="scroll-smooth">
            <body className={clsx(
                spaceGrotesk.variable,
                inter.variable,
                spaceGrotesk.className,
                "bg-background text-foreground antialiased"
            )}>
                <Header dict={dict} lang={lang} />
                {children}
            </body>
        </html>
    );
}
