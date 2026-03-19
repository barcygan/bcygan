"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { Dictionary } from "@/lib/types";

export function Header({ dict, lang }: { dict: Dictionary; lang: string }) {
    const navLinks = [
        { name: dict.nav.start, href: `/${lang}` },
        { name: dict.nav.about, href: `/${lang}#expertise` },
        { name: dict.nav.creator, href: `/${lang}#content-creator` },
        { name: dict.nav.ai, href: `/${lang}#ai-consultant` },
        { name: dict.nav.blog, href: `/${lang}/blog` },
        { name: dict.nav.contact, href: `/${lang}#contact` },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { scrollYProgress } = useScroll();

    useMotionValueEvent(scrollYProgress, "change", (val) => {
        setScrollProgress(val * 100);
        setIsScrolled(val > 0.02);
    });

    return (
        <>
            {/* Scroll progress bar */}
            <div
                className="fixed top-0 left-0 z-[100] h-[2px] bg-primary transition-all duration-100"
                style={{ width: `${scrollProgress}%` }}
            />

            <motion.header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    isScrolled
                        ? "border-b border-border bg-[rgba(8,13,20,0.85)] backdrop-blur-xl py-3"
                        : "bg-transparent py-5"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href={`/${lang}`} className="group flex items-center gap-2">
                        <span className="text-lg font-bold tracking-tighter text-foreground transition-colors group-hover:text-primary">
                            BC<span className="text-primary">.</span>
                        </span>
                        <span className={clsx(
                            "text-sm text-muted-foreground transition-all duration-300",
                            isScrolled ? "opacity-100" : "opacity-0"
                        )}>
                            Bartłomiej Cygan
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="link-draw text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Lang switcher */}
                        <div className="flex items-center gap-1 ml-4 border border-border">
                            <Link
                                href="/pl"
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    lang === "pl"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                PL
                            </Link>
                            <Link
                                href="/en"
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    lang === "en"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                EN
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 border-b border-border bg-[rgba(8,13,20,0.97)] backdrop-blur-xl md:hidden p-6"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex items-center gap-2 pt-4 border-t border-border">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider mr-2">Lang:</span>
                                <Link href="/pl" className={clsx("px-3 py-1 text-xs font-bold border border-border", lang === "pl" ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground")} onClick={() => setMobileMenuOpen(false)}>PL</Link>
                                <Link href="/en" className={clsx("px-3 py-1 text-xs font-bold border border-border", lang === "en" ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground")} onClick={() => setMobileMenuOpen(false)}>EN</Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </motion.header>
        </>
    );
}
