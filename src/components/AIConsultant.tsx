"use client";

import { motion, useInView } from "framer-motion";
import { Bot, TrendingUp, Cpu, CheckCircle2 } from "lucide-react";
import { Section } from "./Section";
import { Dictionary } from "@/lib/types";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 1200;
        const startTime = Date.now();
        const frame = () => {
            const progress = Math.min((Date.now() - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(start + (to - start) * eased));
            if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }, [inView, to]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export function AIConsultant({ dict }: { dict: Dictionary }) {
    return (
        <Section
            id="ai-consultant"
            sectionNumber="04 — AI for Business"
            title={dict.ai.title}
            subtitle={dict.ai.subtitle}
            className="bg-background"
        >
            <div className="grid gap-0 border border-border lg:grid-cols-2">
                {/* Left: content */}
                <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border">
                    <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 mb-8">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            {dict.ai.badge}
                        </span>
                    </div>

                    <h3 className="mb-6 text-3xl font-black leading-none tracking-tighter md:text-4xl text-foreground">
                        {dict.ai.headingMain}
                        <br />
                        <span className="gradient-text">{dict.ai.headingSub}</span>
                    </h3>

                    <p className="mb-10 text-muted-foreground leading-relaxed">
                        {dict.ai.description}
                    </p>

                    <ul className="grid gap-3 sm:grid-cols-2">
                        {dict.ai.list.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 text-sm text-muted-foreground"
                            >
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Right: stats grid */}
                <div className="grid grid-cols-2 divide-x divide-y divide-border">
                    {[
                        { icon: <TrendingUp className="h-6 w-6 text-green-400" />, value: 40, suffix: "%", label: dict.ai.stats.efficiency, prefix: "+" },
                        { icon: <Cpu className="h-6 w-6 text-primary" />, value: 24, suffix: "/7", label: dict.ai.stats.assistants, prefix: "" },
                        { icon: <Bot className="h-6 w-6 text-purple-400" />, value: 100, suffix: "%", label: dict.ai.stats.fit, prefix: "" },
                        { icon: <CheckCircle2 className="h-6 w-6 text-cyan-400" />, value: 14, suffix: "", label: "CEE Markets", prefix: "" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col gap-4 p-8 hover:bg-accent/20 transition-colors"
                        >
                            {stat.icon}
                            <div>
                                <div className="text-3xl font-black text-foreground">
                                    {stat.prefix}
                                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
