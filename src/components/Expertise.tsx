"use client";

import { motion } from "framer-motion";
import { BarChart3, ShoppingBag, Video } from "lucide-react";
import { Section } from "./Section";
import { Dictionary } from "@/lib/types";

const icons = [
    <Video className="h-7 w-7 text-cyan-400" />,
    <BarChart3 className="h-7 w-7 text-primary" />,
    <ShoppingBag className="h-7 w-7 text-purple-400" />,
];

const accentColors = ["text-cyan-400", "text-primary", "text-purple-400"];
const bigNumbers = ["01", "02", "03"];

export function Expertise({ dict }: { dict: Dictionary }) {
    return (
        <Section
            id="expertise"
            sectionNumber="01 — Expertise"
            title={dict.expertise.title}
            subtitle={dict.expertise.subtitle}
            className="bg-background"
        >
            <div className="grid gap-0 md:grid-cols-3 border border-border">
                {dict.expertise.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        className="group relative overflow-hidden border-r border-border last:border-r-0 p-8 transition-all hover:bg-accent/30"
                    >
                        {/* Big background number */}
                        <span
                            className="absolute top-4 right-4 text-7xl font-black leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110"
                            style={{ color: "rgba(59,130,246,0.06)" }}
                        >
                            {bigNumbers[index]}
                        </span>

                        {/* Hover accent line */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />

                        <div className="relative z-10 flex flex-col h-full gap-5">
                            <div className="flex items-center gap-3">
                                <div className="border border-border p-2.5 transition-colors group-hover:border-primary/50">
                                    {icons[index]}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${accentColors[index]}`}>
                                    {bigNumbers[index]}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground">
                                {item.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
