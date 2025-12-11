import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
    "bg-white overflow-hidden transition-all",
    {
        variants: {
            variant: {
                // Neo Brutalism card
                brutal:
                    "border-4 border-black rounded-xl",
                // Minimal card
                minimal:
                    "border-2 border-black rounded-lg",
                // Ghost card (no border)
                ghost:
                    "rounded-xl",
            },
            shadow: {
                none: "",
                sm: "shadow-[2px_2px_0px_#000]",
                md: "shadow-[4px_4px_0px_#000]",
                lg: "shadow-[6px_6px_0px_#000]",
                xl: "shadow-[8px_8px_0px_#000]",
            },
            hover: {
                none: "",
                lift: "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]",
                liftSm: "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000]",
                grow: "hover:scale-[1.02]",
            },
        },
        defaultVariants: {
            variant: "brutal",
            shadow: "md",
            hover: "none",
        },
    }
)

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, shadow, hover, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, shadow, hover, className }))}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

// Card Header
const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 border-b-4 border-black", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

// Card Content
const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Card Footer
const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 border-t-4 border-black", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

// Card Title
const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-black text-xl tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

// Card Description
const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-gray-600 mt-1", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, cardVariants }
