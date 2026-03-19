"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { Dictionary } from "@/lib/types";

export function Contact({ dict }: { dict: Dictionary }) {
    return (
        <footer id="contact" className="relative overflow-hidden bg-[#040810] border-t border-border">
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
                {/* Section label */}
                <div className="mb-12 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">05 — Contact</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                {/* Main CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl md:text-7xl mb-6 leading-none">
                        {dict.contact.title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
                        {dict.contact.subtitle}
                    </p>

                    <motion.a
                        href="mailto:kontakt@bartekcygan.pl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group inline-flex items-center gap-4 border border-primary/30 bg-primary/5 px-10 py-5 text-xl font-bold text-foreground transition-all hover:border-primary hover:bg-primary/10"
                    >
                        <Mail className="h-6 w-6 text-primary" />
                        <span className="link-draw">kontakt@bartekcygan.pl</span>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </motion.a>
                </motion.div>

                {/* Divider */}
                <div className="divider-accent mb-12" />

                {/* Bottom row */}
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex gap-4"
                    >
                        {[
                            { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "#" },
                            { icon: <Instagram className="h-5 w-5" />, label: "Instagram", href: "#" },
                            { icon: <Youtube className="h-5 w-5" />, label: "YouTube", href: "#" },
                        ].map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="group flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                            >
                                {icon}
                            </a>
                        ))}
                    </motion.div>

                    {/* Auto lang detection note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-muted-foreground text-center"
                    >
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-green-500 inline-block animate-pulse" />
                            Auto language detection active (PL / EN)
                        </span>
                    </motion.div>

                    {/* Copyright */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xs text-muted-foreground"
                    >
                        &copy; {new Date().getFullYear()} {dict.contact.rights}
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
