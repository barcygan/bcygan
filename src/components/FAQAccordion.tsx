"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { clsx } from "clsx";

export interface FAQItem {
    question: string;
    answer: string;
}

export function FAQAccordion({ faqs, title = "FAQ" }: { faqs: FAQItem[], title?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
                {title}
            </h2>
            <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div 
                            key={index} 
                            className="border border-border bg-card/30 backdrop-blur-sm overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5 focus:outline-none"
                            >
                                <span className={clsx("font-bold text-lg transition-colors", isOpen ? "text-primary" : "text-foreground")}>
                                    {faq.question}
                                </span>
                                <span className="ml-4 flex-shrink-0 text-muted-foreground">
                                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </span>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
