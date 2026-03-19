"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, MountainSnow, Play, Video, Eye, Users } from "lucide-react";
import { Section } from "./Section";
import { Dictionary } from "@/lib/types";

export function ContentCreator({ dict }: { dict: Dictionary }) {
    const platforms = [
        {
            icon: <Eye className="h-5 w-5 text-primary" />,
            name: "Total Views",
            stat: "1M+",
            label: "All Social Media",
            color: "border-primary/20 hover:border-primary/50",
            url: undefined,
        },
        {
            icon: <Instagram className="h-5 w-5 text-pink-500" />,
            name: "IG & Meta",
            stat: "5.5k+",
            label: "Followers",
            color: "border-pink-500/20 hover:border-pink-500/50",
            url: "https://www.instagram.com/_skidoctor/reels/?__d=1%2F%3Fhidemenu%3Dtrue",
        },
        {
            icon: <Video className="h-5 w-5 text-cyan-400" />,
            name: "TikTok",
            stat: "2.5k+",
            label: "Followers",
            color: "border-cyan-400/20 hover:border-cyan-400/50",
            url: "https://www.tiktok.com/@skidoctor_",
        },
    ];

    return (
        <Section
            id="content-creator"
            sectionNumber="03 — Content & Skiing"
            title={dict.contentCreator.title}
            subtitle={dict.contentCreator.subtitle}
            className="bg-card border-y border-border"
        >
            <div className="grid gap-0 border border-border lg:grid-cols-2">
                {/* Left: text area */}
                <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="border border-border p-3">
                            <MountainSnow className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-1">
                                Passion
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter text-foreground">
                                {dict.contentCreator.skiing}
                            </h3>
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        {dict.contentCreator.description}
                    </p>

                    {/* Platform cards */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {platforms.map((platform, i) => {
                            const CardComponent = platform.url ? motion.a : motion.div;
                            
                            return (
                                <CardComponent
                                    key={i}
                                    href={platform.url}
                                    target={platform.url ? "_blank" : undefined}
                                    rel={platform.url ? "noopener noreferrer" : undefined}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className={`group border bg-background p-5 transition-all cursor-pointer ${platform.color}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        {platform.icon}
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            {platform.name}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-black text-foreground">{platform.stat}</div>
                                    <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                                        {platform.label}
                                    </div>
                                </CardComponent>
                            );
                        })}
                    </div>
                </div>

                {/* Right: visual showcase */}
                <div className="relative min-h-[360px] overflow-hidden bg-slate-900">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent z-10" />

                    {/* Background real image */}
                    <div className="absolute inset-0">
                        <img 
                            src="/ski-hero.png" 
                            alt="Cinematic ski shot" 
                            className="w-full h-full object-cover scale-105"
                        />
                    </div>

                    {/* Dark overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10" />

                    {/* Video placeholders grid */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 p-6 sm:flex-row sm:gap-8">
                        {/* TikTok Placeholder */}
                        <a 
                            href="https://www.tiktok.com/@skidoctor_/video/7593316113019194646" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative h-[280px] w-[160px] sm:h-[340px] sm:w-[190px] overflow-hidden rounded-xl border border-white/20 bg-black/40 backdrop-blur-md transition-transform hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-[-2deg]"
                        >
                            {/* Background Thumbnail */}
                            <div className="absolute inset-0">
                                <img src="/tiktok-thumb.jpg" alt="TikTok Thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform group-hover:scale-110">
                                    <Play className="h-5 w-5 text-white ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="mb-2 flex items-center gap-2">
                                    <Video className="h-4 w-4 text-cyan-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 drop-shadow-md">Viral Hit</span>
                                </div>
                                <div className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">learn butter 360</div>
                                <div className="mt-1 text-xs text-white/80 drop-shadow-md">370K+ Views</div>
                            </div>
                        </a>

                        {/* Instagram Placeholder */}
                        <a 
                            href="https://www.instagram.com/_skidoctor/reel/DTI4I-WDgDc/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative h-[280px] w-[160px] sm:h-[340px] sm:w-[190px] overflow-hidden rounded-xl border border-white/20 bg-black/40 backdrop-blur-md transition-transform hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] rotate-[3deg] sm:mt-12"
                        >
                            {/* Background Thumbnail */}
                            <div className="absolute inset-0">
                                <img src="/ig-thumb.png" alt="Instagram Thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform group-hover:scale-110">
                                    <Play className="h-5 w-5 text-white ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="mb-2 flex items-center gap-2">
                                    <Instagram className="h-4 w-4 text-pink-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500 drop-shadow-md">Top Reel</span>
                                </div>
                                <div className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">use your feet's!</div>
                                <div className="mt-1 text-xs text-white/80 drop-shadow-md">850K Views</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </Section>
    );
}
