import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center font-mono text-xs font-bold uppercase border-2 border-black px-3 py-1 transition-all",
    {
        variants: {
            variant: {
                // Product badges
                new: "bg-yellow-400 text-black rounded-lg shadow-[2px_2px_0px_#000]",
                sale: "bg-red-500 text-white rounded-lg shadow-[2px_2px_0px_#000]",
                featured: "bg-yellow-400 text-black rounded-lg shadow-[2px_2px_0px_#000]",
                soldOut: "bg-black text-white rounded-lg",

                // Status badges  
                success: "bg-green-500 text-white rounded-lg shadow-[2px_2px_0px_#000]",
                warning: "bg-yellow-400 text-black rounded-lg shadow-[2px_2px_0px_#000]",
                error: "bg-red-500 text-white rounded-lg shadow-[2px_2px_0px_#000]",
                info: "bg-blue-500 text-white rounded-lg shadow-[2px_2px_0px_#000]",

                // Category/Tag badges
                category: "bg-black text-white rounded-lg",
                tag: "bg-white text-black rounded-lg shadow-[2px_2px_0px_#000]",
                count: "bg-yellow-400 text-black rounded-full px-2 py-0.5 text-[10px]",

                // Order status
                pending: "bg-yellow-400 text-black rounded-lg",
                confirmed: "bg-blue-500 text-white rounded-lg",
                processing: "bg-blue-500 text-white rounded-lg",
                shipped: "bg-blue-500 text-white rounded-lg",
                delivered: "bg-green-500 text-white rounded-lg",
                cancelled: "bg-red-500 text-white rounded-lg",
                refunded: "bg-red-500 text-white rounded-lg",
            },
            size: {
                default: "text-xs px-3 py-1",
                sm: "text-[10px] px-2 py-0.5",
                lg: "text-sm px-4 py-1.5",
            },
            rotate: {
                none: "",
                left: "-rotate-2",
                right: "rotate-2",
            },
        },
        defaultVariants: {
            variant: "new",
            size: "default",
            rotate: "none",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, size, rotate, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(badgeVariants({ variant, size, rotate, className }))}
                {...props}
            />
        )
    }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
