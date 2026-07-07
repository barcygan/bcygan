"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Smartphone, 
    TrendingUp, 
    ShieldCheck, 
    Database, 
    ChevronDown, 
    ArrowUpRight, 
    Zap,
    Briefcase,
    Mail
} from "lucide-react";
import { useState } from "react";
import { Section } from "./Section";

interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQAccordionItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border bg-card/50 backdrop-blur-sm transition-all duration-300">
            <button
                className="flex w-full items-center justify-between p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold text-foreground text-lg pr-4">{question}</span>
                <ChevronDown 
                    className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-sm leading-relaxed text-muted-foreground border-t border-border/50">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function AppAnalyticsLP({ lang }: { lang: string }) {
    const isPl = lang === "pl";

    const content = {
        badge: isPl ? "Dedykowana analityka mobilna" : "Dedicated Mobile Analytics",
        heroTitle: isPl 
            ? "Specjalista ds. Analityki w Aplikacji" 
            : "Mobile App Analytics Specialist",
        heroSubtitle: isPl 
            ? "Pomagam firmom e-commerce i aplikacjom subskrypcyjnym mierzyć zachowania użytkowników, optymalizować konwersję i podejmować decyzje na bazie twardych danych." 
            : "Helping e-commerce and subscription-based mobile apps track user behavior, optimize conversion funnels, and grow revenue through clean data.",
        heroCta: isPl ? "Skonsultuj swoją aplikację" : "Schedule a Consultation",
        heroSubCta: isPl ? "Poznaj moje doświadczenie" : "See my experience",
        
        // Pain points
        painTitle: isPl ? "Gdzie uciekają przychody w Twojej aplikacji?" : "Where is your app losing revenue?",
        painSubtitle: isPl 
            ? "Większość aplikacji posiada luki w analityce, które uniemożliwiają poprawną optymalizację wydatków marketingowych i produktu."
            : "Most mobile apps suffer from major tracking gaps that make it impossible to optimize user acquisition costs and product updates.",
        pains: [
            {
                title: isPl ? "Porzucenia po instalacji (User Drop-off)" : "Drop-off after installation",
                desc: isPl 
                    ? "Nawet 80% użytkowników porzuca aplikację w ciągu pierwszych 3 dni. Bez wdrożonej analityki produktowej nie wiesz, w którym kroku onboardingu odchodzą." 
                    : "Up to 80% of users drop off within the first 3 days. Without product analytics, you don't know where they get stuck in your onboarding flow."
            },
            {
                title: isPl ? "Czarna skrzynka subskrypcji (In-App Purchases)" : "The Subscription Black Box",
                desc: isPl 
                    ? "Niepełne dane o odnowieniach, anulowaniach czy okresach próbnych. Integruję analitykę z RevenueCat, łącząc dane finansowe z realnym zachowaniem użytkowników." 
                    : "Gaps in renewal, cancellation, or trial data. I integrate app tracking with tools like RevenueCat to link financial data with user behaviors."
            },
            {
                title: isPl ? "Zniekształcona atrybucja i ruch z Social Media" : "Skewed Attribution & Social Traffic",
                desc: isPl 
                    ? "Ruch z TikTok/Instagram in-app browsers często gubi się w standardowych raportach. Tworzę strategie atrybucji (AppsFlyer, GTM Server-Side) mierzące realne ROI." 
                    : "Social media (TikTok, Instagram) in-app browser traffic is notoriously hard to track. I build MMP/GTM Server-Side solutions for accurate ROI."
            }
        ],

        // Services
        servicesTitle: isPl ? "Obszary wdrożeń i optymalizacji" : "Services & Implementations",
        servicesSubtitle: isPl 
            ? "Od projektu planu pomiarów, przez wdrożenie SDK, aż po automatyzację raportowania w BigQuery."
            : "From measurement strategy and SDK integration to automated data warehouse reporting in BigQuery.",
        services: [
            {
                icon: <Smartphone className="h-6 w-6 text-primary" />,
                title: isPl ? "Wdrożenia SDK & Analityka Produktowa" : "SDK Implementation & Product Analytics",
                desc: isPl 
                    ? "Firebase Analytics, Amplitude, Mixpanel. Projektuję dedykowane plany pomiarów (SDR - Schema), wdrażam niestandardowe zdarzenia i parametry śledzące całą ścieżkę klienta." 
                    : "Firebase, Amplitude, Mixpanel. I design measurement strategies (tracking plans), implement custom event schemas, and track full user lifecycles."
            },
            {
                icon: <TrendingUp className="h-6 w-6 text-green-400" />,
                title: isPl ? "Optymalizacja Subskrypcji i Lejka E-commerce" : "Subscription & E-commerce Funnel Optimization",
                desc: isPl 
                    ? "Dokładna analiza koszyka zakupowego, transakcji in-app i cyklu życia subskrypcji (LTV, cohort analysis, churn rate). Integracja płatności ze sklepami App Store i Google Play." 
                    : "Detailed checkout analysis, in-app purchases, and subscription metrics (LTV, cohort analysis, churn rate). Integration with App Store Connect and Google Play."
            },
            {
                icon: <ShieldCheck className="h-6 w-6 text-purple-400" />,
                title: isPl ? "Atrybucja Marketingowa (MMP) & RODO" : "Mobile Attribution (MMP) & Privacy",
                desc: isPl 
                    ? "Konfiguracja narzędzi Mobile Measurement Partner (AppsFlyer, Adjust). Rozwiązania zgodne z Apple ATT i Android Privacy Sandbox przy jednoczesnym zachowaniu danych o kampaniach." 
                    : "Setting up Mobile Measurement Partners (AppsFlyer, Adjust). Implementing privacy-compliant setups (Apple ATT, Android Privacy Sandbox) while preserving marketing ROI data."
            },
            {
                icon: <Database className="h-6 w-6 text-cyan-400" />,
                title: isPl ? "Analityka Chmurowa & BigQuery SQL" : "Cloud Analytics & BigQuery SQL",
                desc: isPl 
                    ? "Łączenie surowych danych z aplikacji z bazami CRM. Automatyzacja zrzutów danych, pisanie zapytań SQL w BigQuery i tworzenie zaawansowanych raportów (Looker Studio, Tableau)." 
                    : "Merging raw app events with CRM data in BigQuery. Building custom SQL pipelines, automated reporting, and interactive dashboards (Looker Studio, Tableau)."
            }
        ],

        // Case studies
        expTitle: isPl ? "Sprawdzone w skali Enterprise i startupach" : "Proven at Enterprise Scale & Startups",
        expSubtitle: isPl 
            ? "Moje doświadczenie analityczne opiera się na projektach realizowanych dla milionów użytkowników."
            : "My analytics expertise is backed by shipping systems for millions of active users.",
        cases: [
            {
                metric: "14",
                metricLabel: isPl ? "Rynków CEE w Decathlon" : "CEE Markets at Decathlon",
                text: isPl 
                    ? "Jako Digital Analytics Business Partner wspieram analitykę aplikacji mobilnej i e-commerce na dużą skalę, dbając o spójność wdrożeń i MarTech." 
                    : "As a Digital Analytics Business Partner, I manage app and web analytics setups across 14 countries, leading MarTech standardizations."
            },
            {
                metric: "1M+",
                metricLabel: isPl ? "Wyświetleń w social media" : "Social media views",
                text: isPl 
                    ? "Dzięki własnej marce (skidoctor) doskonale rozumiem optymalizację atrybucji ruchu in-app, który napływa z social media do przeglądarek wewnątrz aplikacji." 
                    : "Running my own technical ski teaching brand gives me first-hand experience optimizing in-app browser traffic attribution from Instagram and TikTok."
            },
            {
                metric: "SQL/BQ",
                metricLabel: isPl ? "Analiza danych w WP" : "Data Analysis at WP",
                text: isPl 
                    ? "W Wirtualnej Polsce pracowałem na surowych bazach danych, tworząc zaawansowane strategie śledzenia produktów webowych i mobilnych przy użyciu SQL i BigQuery." 
                    : "At Wirtualna Polska, I queried massive raw databases, designing web and mobile product tracking strategies using SQL and Google Cloud Platform."
            }
        ],

        // Privacy
        privacyTitle: isPl ? "Rozszyfrowana prywatność (In-App Privacy Resolved)" : "In-App Privacy Mystery Resolved",
        privacySubtitle: isPl 
            ? "Ograniczenia Apple ATT i Android Privacy Sandbox spędzają sen z powiek marketerom. Wdrażam rozwiązania, które są zgodne z RODO i zachowują pełną analitykę."
            : "Apple ATT and Android Privacy Sandbox limitations cause headaches for marketers. I implement setups that are 100% compliant and preserve your tracking data.",
        privacyItems: [
            {
                title: isPl ? "Apple ATT & SKAdNetwork" : "Apple ATT & SKAdNetwork",
                desc: isPl 
                    ? "Wyskakujące okienko zgody (ATT) sprawiło, że ponad 60% użytkowników klika 'Nie zezwalaj'. Rozszyfrowuję protokół SKAdNetwork oraz mapowanie Conversion Value, aby przywrócić wgląd w skuteczność kampanii na iOS bez naruszania prywatności."
                    : "The ATT prompt causes over 60% of users to select 'Ask App not to Track'. I decode the SKAdNetwork protocol and Conversion Value mappings to restore iOS campaign visibility without breaking privacy."
            },
            {
                title: isPl ? "Android Privacy Sandbox" : "Android Privacy Sandbox",
                desc: isPl 
                    ? "Google stopniowo wycofuje identyfikator reklamowy (GAID) na rzecz nowej piaskownicy prywatności (Privacy Sandbox). Pomagam zaadaptować analitykę do nowych interfejsów API (Topics, Attribution Reporting) przed wejściem zmian w życie."
                    : "Google is phasing out Advertising IDs (GAIDs) in favor of Privacy Sandbox. I help prepare your tracking pipelines for Android's new APIs (Topics, Protected Audience, Attribution Reporting) early."
            },
            {
                title: isPl ? "MMP & Tagowanie Server-Side" : "MMP & Server-Side Tracking",
                desc: isPl 
                    ? "Zamiast polegać na plikach cookie i lokalnych identyfikatorach, wdrażam hybrydowe śledzenie Server-Side (GTM) połączone z Mobile Measurement Partners (AppsFlyer/Adjust). Dane są bezpieczne, stabilne i precyzyjnie mierzone."
                    : "Instead of relying on cookies and device IDs, I implement hybrid GTM Server-Side setups integrated with Mobile Measurement Partners (AppsFlyer/Adjust) for secure, first-party data flows."
            }
        ],

        // FAQ
        faqTitle: isPl ? "Często Zadawane Pytania (FAQ)" : "Frequently Asked Questions",
        faqSubtitle: isPl ? "Odpowiedzi na najczęstsze pytania o analitykę w aplikacji." : "Answers to common questions about mobile app tracking.",
        faqs: [
            {
                q: isPl 
                    ? "Czym różni się analityka w aplikacji od tradycyjnej analityki stron www?" 
                    : "How does mobile app analytics differ from web analytics?",
                a: isPl 
                    ? "Analityka mobilna opiera się całkowicie na modelu zdarzeniowym (event-driven tracking). W przeciwieństwie do stron www nie ma tu pojęcia tradycyjnej odsłony strony (pageview) – zamiast tego śledzimy stany widoków (screen_view). Wymaga to implementacji dedykowanych bibliotek (SDK) w kodzie aplikacji oraz integracji ze sklepami App Store/Google Play pod kątem transakcji, co jest znacznie bardziej techniczne niż instalacja prostego kodu śledzenia na stronie."
                    : "Mobile app analytics is strictly event-driven. Unlike traditional web analytics, pageviews don't exist; we track screen views instead. It requires installing platform-specific SDKs inside the app codebase and configuring server-to-store integrations (App Store Connect, Google Play Console) for purchase events, making it highly technical compared to standard web setups."
            },
            {
                q: isPl 
                    ? "Kiedy powinienem zatrudnić specjalistę ds. analityki w aplikacji?" 
                    : "When should I hire a mobile app analytics specialist?",
                a: isPl 
                    ? "Zatrudnienie specjalisty ds. analityki w aplikacji jest kluczowe w trzech momentach: 1) Przed startem kampanii marketingowych (user acquisition), aby poprawnie skonfigurować atrybucję i nie przepalać budżetu. 2) Po wdrożeniu modelu subskrypcyjnego, aby precyzyjnie mierzyć LTV i churn. 3) Kiedy widzisz, że użytkownicy szybko rezygnują z aplikacji, a standardowe raporty nie pokazują dokładnego miejsca, w którym porzucają Twój produkt."
                    : "You should hire a specialist in three key scenarios: 1) Before launching paid user acquisition campaigns, to set up attribution and avoid wasting ad budget. 2) When introducing subscriptions, to precisely trace subscriber LTV and cohort churn. 3) When experiencing low user retention and standard reports fail to pinpoint the exact screen where users drop off."
            },
            {
                q: isPl 
                    ? "Jakie narzędzia polecasz do analityki aplikacji?" 
                    : "Which analytics tools do you recommend?",
                a: isPl 
                    ? "Standardem rynkowym i solidnym fundamentem jest Google Analytics for Firebase. Do głębokiej analityki produktowej i badania zachowań (ścieżki, kohorty, retencja) najlepiej sprawdza się Amplitude lub Mixpanel. Jeśli aplikacja opiera się na subskrypcjach, absolutną koniecznością jest wdrożenie RevenueCat, które dostarcza bezbłędne dane o transakcjach. Do atrybucji kampanii płatnych najlepiej wdrożyć AppsFlyer lub Adjust."
                    : "Firebase is a solid foundation for general metrics. For deep product and behavioral analysis (cohorts, user flows, retention), Amplitude or Mixpanel are industry standards. If your app relies on subscription revenue, RevenueCat is a must-have for tracking clean financial events. For paid marketing campaign attribution, I recommend AppsFlyer or Adjust."
            },
            {
                q: isPl 
                    ? "Jak radzisz sobie z ograniczeniami iOS (App Tracking Transparency)?" 
                    : "How do you handle iOS ATT and privacy regulations?",
                a: isPl 
                    ? "Wykorzystuję integrację z certyfikowanymi systemami MMP (Mobile Measurement Partners) oraz technologię Google Tag Manager Server-Side. Dzięki temu możemy bezpiecznie i zgodnie z prawem modelować konwersje, odczytywać dane o kampaniach i przesyłać je bezpośrednio z serwera do platform reklamowych (np. Meta CAPI, Google Ads API), co chroni dane użytkowników i jednocześnie optymalizuje koszty marketingu."
                    : "I leverage Mobile Measurement Partners (MMPs) and Google Tag Manager Server-Side implementations. This allows us to securely model conversions and send attribution data server-to-server (e.g., Meta CAPI, Google Ads API) in a privacy-compliant manner, ensuring campaign performance while adhering to Apple's ATT and GDPR guidelines."
            }
        ],

        // CTA
        ctaTitle: isPl ? "Zbudujmy analitykę, która generuje wzrost" : "Let's build analytics that drives growth",
        ctaText: isPl 
            ? "Masz pytania dotyczące wdrożenia Firebase, Amplitude, atrybucji marketingowej lub analityki subskrypcji? Porozmawiajmy o Twojej aplikacji."
            : "Have questions about Firebase, Amplitude, marketing attribution, or subscription metrics? Let's discuss your application.",
        ctaBtn: isPl ? "Napisz do mnie" : "Get in Touch"
    };

    return (
        <div className="relative min-h-screen bg-background">
            {/* Ambient Background Grid and glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] aurora-bg opacity-30 blur-3xl" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
                <div className="absolute inset-0 grid-bg opacity-30" />
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 mb-6"
                    >
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            {content.badge}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-none"
                    >
                        {isPl ? (
                            <>
                                Specjalista ds. <br />
                                <span className="gradient-text">Analityki w Aplikacji</span>
                            </>
                        ) : (
                            <>
                                Mobile App <br />
                                <span className="gradient-text">Analytics Specialist</span>
                            </>
                        )}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {content.heroSubtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <a
                            href="#contact-analytics"
                            className="group inline-flex items-center gap-2 border border-primary bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-transparent hover:text-foreground hover:border-primary/50"
                        >
                            <span>{content.heroCta}</span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                        <a
                            href="#experience-cases"
                            className="link-draw text-sm font-bold text-muted-foreground hover:text-foreground py-2"
                        >
                            {content.heroSubCta}
                        </a>
                    </motion.div>
                </div>
            </section>

            <div className="divider-accent mx-auto max-w-6xl" />

            {/* PAIN POINTS SECTION */}
            <Section id="pain-points" title={content.painTitle} subtitle={content.painSubtitle}>
                <div className="grid gap-6 md:grid-cols-3">
                    {content.pains.map((pain, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="border border-border bg-card p-8 hover:border-primary/40 hover:bg-accent/10 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="text-xs font-mono text-primary mb-4">0{i+1} — PROBLEM</div>
                                <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">{pain.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{pain.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* SERVICES SECTION */}
            <div className="bg-card border-y border-border">
                <Section id="services" title={content.servicesTitle} subtitle={content.servicesSubtitle}>
                    <div className="grid gap-8 md:grid-cols-2">
                        {content.services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="flex gap-6 p-6 border border-border/50 bg-background/50 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex-shrink-0 h-12 w-12 border border-border flex items-center justify-center bg-card">
                                    {service.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* PRIVACY SECTION */}
            <Section id="privacy" title={content.privacyTitle} subtitle={content.privacySubtitle} className="bg-background">
                <div className="grid gap-8 md:grid-cols-3">
                    {content.privacyItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative border border-border bg-card/50 backdrop-blur-sm p-8 hover:border-primary/40 hover:bg-accent/10 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Accent corner effect */}
                            <div className="absolute top-0 right-0 h-2 w-2 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                            
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* EXPERIENCE & CASE STUDIES SECTION */}
            <Section 
                id="experience-cases" 
                title={content.expTitle} 
                subtitle={content.expSubtitle}
            >
                <div className="grid gap-8 lg:grid-cols-3">
                    {content.cases.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="group border border-border bg-card/30 p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-300"
                        >
                            <div>
                                <div className="text-5xl font-black text-primary tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                                    {item.metric}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
                                    {item.metricLabel}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Micro tech-stack badge display */}
                <div className="mt-16 border border-border bg-card/20 p-8">
                    <div className="text-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {isPl ? "Narzędzia, z którymi pracuję na co dzień" : "Tech stack I utilize daily"}
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {[
                            "Amplitude", "Firebase", "Google Analytics 4", "BigQuery", 
                            "SQL", "RevenueCat", "AppsFlyer", "Adjust", "Mixpanel", "GTM Server-Side"
                        ].map((tech) => (
                            <span 
                                key={tech} 
                                className="px-4 py-2 border border-border bg-card/60 text-xs font-bold text-foreground font-mono hover:border-primary/50 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </Section>

            {/* FAQ SECTION */}
            <div className="bg-card border-t border-border">
                <Section id="faq" title={content.faqTitle} subtitle={content.faqSubtitle}>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {content.faqs.map((faq, i) => (
                            <FAQAccordionItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </Section>
            </div>

            {/* CONTACT CTA SECTION */}
            <section id="contact-analytics" className="relative overflow-hidden bg-[#040810] border-t border-border py-24 px-4 sm:px-6 lg:px-8">
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.06) 0%, transparent 70%)"
                }} />
                
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground mb-6 leading-none">
                            {content.ctaTitle}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            {content.ctaText}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <motion.a
                                href="mailto:bart@bcygan.eu?subject=Analityka%20Aplikacji%20Mobilnych"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group inline-flex items-center gap-4 border border-primary/30 bg-primary/5 px-10 py-5 text-xl font-bold text-foreground transition-all hover:border-primary hover:bg-primary/10"
                            >
                                <Mail className="h-6 w-6 text-primary" />
                                <span className="link-draw">{content.ctaBtn}</span>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </motion.a>
                            
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-2 link-draw"
                            >
                                <Briefcase className="h-4 w-4" />
                                <span>LinkedIn &rarr;</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
