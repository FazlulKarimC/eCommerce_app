import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
    "animate-pulse bg-gray-200",
    {
        variants: {
            variant: {
                // Neo Brutalism skeleton
                brutal: "border-2 border-black rounded-lg",
                // Simple skeleton
                default: "rounded-md",
            },
            shape: {
                rectangle: "",
                square: "aspect-square",
                circle: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            shape: "rectangle",
        },
    }
)

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> { }

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant, shape, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(skeletonVariants({ variant, shape, className }))}
                {...props}
            />
        )
    }
)
Skeleton.displayName = "Skeleton"

// Preset skeleton components for common use cases

interface SkeletonCardProps {
    className?: string
    showImage?: boolean
    lines?: number
}

export function SkeletonCard({
    className,
    showImage = true,
    lines = 2
}: SkeletonCardProps) {
    return (
        <div className={cn(
            "bg-white border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000]",
            className
        )}>
            {showImage && (
                <Skeleton className="aspect-square w-full border-0 rounded-none" />
            )}
            <div className="p-4 space-y-3">
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={cn(
                            "h-4",
                            i === 0 ? "w-3/4" : "w-1/2"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

export function SkeletonText({
    lines = 3,
    className
}: {
    lines?: number
    className?: string
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 ? "w-2/3" : "w-full"
                    )}
                />
            ))}
        </div>
    )
}

export function SkeletonAvatar({
    size = "default",
    className
}: {
    size?: "sm" | "default" | "lg"
    className?: string
}) {
    const sizeClasses = {
        sm: "w-8 h-8",
        default: "w-10 h-10",
        lg: "w-14 h-14",
    }

    return (
        <Skeleton
            shape="circle"
            className={cn(sizeClasses[size], className)}
        />
    )
}

export function SkeletonButton({
    size = "default",
    className
}: {
    size?: "sm" | "default" | "lg"
    className?: string
}) {
    const sizeClasses = {
        sm: "h-9 w-20",
        default: "h-11 w-28",
        lg: "h-14 w-36",
    }

    return (
        <Skeleton
            variant="brutal"
            className={cn(sizeClasses[size], className)}
        />
    )
}

export { Skeleton, skeletonVariants }
