import { clsx } from "clsx";
import { ReactNode } from "react";

interface SectionProps {
    id?: string;
    className?: string;
    title?: string;
    subtitle?: string;
    sectionNumber?: string;
    children: ReactNode;
    dark?: boolean;
}

export function Section({ id, className, title, subtitle, sectionNumber, children }: SectionProps) {
    return (
        <section
            id={id}
            className={clsx(
                "relative w-full py-24 px-4 sm:px-6 lg:px-8",
                className
            )}
        >
            <div className="mx-auto max-w-6xl">
                {(title || subtitle || sectionNumber) && (
                    <div className="mb-16">
                        {sectionNumber && (
                            <div className="mb-4 flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                                    {sectionNumber}
                                </span>
                                <div className="h-px flex-1 bg-border" />
                            </div>
                        )}
                        {title && (
                            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl leading-none text-foreground">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
