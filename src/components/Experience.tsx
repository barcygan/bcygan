"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    description: string;
    roles?: { role: string; period: string; description: string }[];
    current?: boolean;
}

const experienceData: ExperienceItem[] = [
    {
        company: "Decathlon",
        role: "Digital Analytics Business Partner for CEE Region",
        period: "Feb 2025 – Present",
        current: true,
        description: "Supporting digital analytics across 14 markets, with a strong focus on e-comm, MarTech solutions and mobile application.",
        roles: [
            {
                role: "Digital Analytics Business Partner — CEE",
                period: "Feb 2025 – Present",
                description: "Supporting digital analytics across 14 markets, with a strong focus on e-comm, MarTech solutions and mobile application.",
            },
            {
                role: "Digital Analyst",
                period: "Jul 2023 – Feb 2025",
                description: "Responsible for migrating multiple e-commerce platforms at Decathlon to a new analytics tool. Extensive work on reporting and analysis.",
            },
        ],
    },
    {
        company: "AkademiaGorskaBrenna.pl",
        role: "Founder / Winter Sports School",
        period: "2023 – Present",
        current: true,
        description: "Founder and manager of a winter sports school in Brenna. Focusing on skiing instruction and building a strong local brand in the mountains.",
    },
    {
        company: "Wirtualna Polska",
        role: "Data Analyst",
        period: "Jul 2022 – Jul 2023",
        description: "Marketing, product and e-commerce analysis based on raw data (SQL, BigQuery), Google Analytics etc. Web & app tracking strategies.",
    },
    {
        company: "MTA Digital",
        role: "Web Marketing Analyst & Strategist",
        period: "Dec 2021 – Jul 2022",
        description: "Improving business KPIs with digital analytics marketing tools. Using LTV in SEM improvements. Expert in Google Analytics.",
    },
    {
        company: "MW Eurobut",
        role: "Head of Ecommerce",
        period: "Nov 2016 – Dec 2021",
        description: "E-commerce sales strategy. Team management. Internet analytics.",
        roles: [
            {
                role: "Head of Ecommerce",
                period: "Dec 2018 – Dec 2021",
                description: "E-commerce sales strategy. Team management. Internet analytics.",
            },
            {
                role: "Ecommerce Specialist",
                period: "Nov 2016 – Dec 2018",
                description: "Maintaining e-commerce environment, preparing marketing campaigns, business analysis and growth hacking.",
            },
        ],
    },
];

export function Experience() {
    return (
        <Section
            id="experience"
            sectionNumber="02 — Experience"
            title="Career Path"
            subtitle="From e-commerce specialist to Digital Analytics Business Partner across 14 CEE markets."
            className="bg-card border-y border-border"
        >
            <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2" />

                {experienceData.map((item, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                        <div key={index} className="relative mb-12 last:mb-0">
                            {/* Timeline dot */}
                            <div className="absolute left-[-5px] top-0 z-10 md:left-1/2 md:-translate-x-1/2">
                                {item.current ? (
                                    <div className="relative">
                                        <div className="h-3 w-3 bg-primary" />
                                        <div className="absolute inset-0 h-3 w-3 bg-primary pulse-ring" />
                                    </div>
                                ) : (
                                    <div className="h-3 w-3 border border-border bg-background" />
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: 0.05 * index }}
                                className={`relative ml-8 md:ml-0 md:w-[45%] ${isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}
                            >
                                <div className="group border border-border bg-background p-6 transition-all hover:border-primary/40 hover:bg-accent/20">
                                    {/* Period */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-primary">
                                            {item.period || item.roles?.[0].period}
                                        </span>
                                        {item.current && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 border border-primary/30">
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    {/* Company name */}
                                    <h3 className="text-2xl font-black tracking-tighter text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {item.company}
                                    </h3>

                                    {item.roles ? (
                                        <div className="mt-4 space-y-4">
                                            {item.roles.map((role, rIndex) => (
                                                <div key={rIndex} className="border-l-2 border-border pl-4 hover:border-primary transition-colors">
                                                    <div className="font-semibold text-sm text-foreground">{role.role}</div>
                                                    <div className="text-xs text-muted-foreground mb-1 font-mono">{role.period}</div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-sm font-semibold text-muted-foreground">{item.role}</div>
                                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
}
