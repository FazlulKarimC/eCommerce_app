import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
    label: string
    href?: string
    icon?: React.ReactNode
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
    separator?: React.ReactNode
    showHome?: boolean
    className?: string
}

export function Breadcrumb({
    items,
    separator,
    showHome = true,
    className
}: BreadcrumbProps) {
    const allItems: BreadcrumbItem[] = showHome
        ? [{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> }, ...items]
        : items

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
            {allItems.map((item, index) => {
                const isLast = index === allItems.length - 1

                return (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <span className="text-gray-400">
                                {separator || <ChevronRight className="w-4 h-4" />}
                            </span>
                        )}

                        {isLast ? (
                            // Current page (not a link)
                            <span className="text-gray-500 flex items-center gap-1.5">
                                {item.icon}
                                {item.label}
                            </span>
                        ) : item.href ? (
                            // Link
                            <Link
                                href={item.href}
                                className="font-bold hover:text-red-500 transition-colors flex items-center gap-1.5"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            // No link
                            <span className="font-bold flex items-center gap-1.5">
                                {item.icon}
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

// Brutalist back button for simpler navigation
export interface BackButtonProps {
    href: string
    label?: string
    className?: string
}

export function BackButton({
    href,
    label = "Back",
    className
}: BackButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-2 font-bold hover:text-red-500 transition-colors group",
                className
            )}
        >
            <div className="w-8 h-8 bg-white border-4 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all">
                <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
            <span>{label}</span>
        </Link>
    )
}
