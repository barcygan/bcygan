"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Dictionary } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const words = ["Analytics", "E-commerce", "Skiing"];

export function Hero({ dict }: { dict: Dictionary }) {
    const [wordIndex, setWordIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % words.length);
                setVisible(true);
            }, 350);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { value: "14", label: "CEE Markets", suffix: "" },
        { value: "7+", label: "Years Exp.", suffix: "" },
        { value: "60k+", label: "Followers", suffix: "" },
        { value: "100%", label: "Data-Driven", suffix: "" },
    ];

    return (
        <section
            ref={containerRef}
            className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden aurora-bg grid-bg"
        >
            {/* Radial glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)",
                }}
            />

            {/* Noise overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />

            <motion.div
                style={{ opacity, y }}
                className="relative z-10 flex max-w-5xl flex-col items-center gap-6 px-4 text-center"
            >
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3"
                >
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                        {dict.hero.greeting}
                    </span>
                    <div className="h-px w-8 bg-primary" />
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="text-5xl font-bold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-[96px]"
                    style={{ lineHeight: 1.0 }}
                >
                    Bartłomiej Cygan
                </motion.h1>

                {/* Animated word */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex items-center gap-3 text-2xl font-light text-muted-foreground sm:text-3xl md:text-4xl"
                >
                    <span>I master</span>
                    <span
                        className="inline-block min-w-[200px] text-left transition-all duration-300 gradient-text font-semibold"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0px)" : "translateY(-10px)",
                        }}
                    >
                        {words[wordIndex]}
                    </span>
                </motion.div>

                {/* Stats ticker */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-4 flex flex-wrap items-center justify-center gap-px border border-border"
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center px-6 py-4 border-r border-border last:border-r-0"
                        >
                            <span className="text-2xl font-bold text-primary">{stat.value}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-4 flex flex-wrap gap-4 justify-center"
                >
                    <a
                        href="#contact"
                        className="group flex items-center gap-2 bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:gap-3"
                    >
                        {dict.hero.contactBtn}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#expertise"
                        className="flex items-center gap-2 border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                    >
                        {dict.hero.moreBtn}
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
                <div className="h-10 w-px bg-gradient-to-b from-primary to-transparent animate-pulse" />
            </motion.div>
        </section>
    );
}
