'use client'

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export interface QuantityStepperProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    disabled?: boolean
    size?: "sm" | "default" | "lg"
    className?: string
}

const sizeClasses = {
    sm: {
        container: "h-8",
        button: "w-8 h-8",
        icon: "w-3 h-3",
        display: "w-8 text-xs",
    },
    default: {
        container: "h-10",
        button: "w-10 h-10",
        icon: "w-4 h-4",
        display: "w-10 text-sm",
    },
    lg: {
        container: "h-12",
        button: "w-12 h-12",
        icon: "w-5 h-5",
        display: "w-12 text-base",
    },
}

export function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    size = "default",
    className,
}: QuantityStepperProps) {
    const sizes = sizeClasses[size]

    const handleDecrement = () => {
        if (value > min && !disabled) {
            onChange(value - 1)
        }
    }

    const handleIncrement = () => {
        if (value < max && !disabled) {
            onChange(value + 1)
        }
    }

    return (
        <div
            className={cn(
                "inline-flex items-center border-4 border-black rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_#000]",
                sizes.container,
                disabled && "opacity-50",
                className
            )}
        >
            {/* Decrement Button */}
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className={cn(
                    "flex items-center justify-center bg-white hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r-2 border-black",
                    sizes.button
                )}
                aria-label="Decrease quantity"
            >
                <Minus className={sizes.icon} />
            </button>

            {/* Value Display */}
            <span
                className={cn(
                    "flex items-center justify-center font-black bg-white",
                    sizes.display
                )}
            >
                {value}
            </span>

            {/* Increment Button */}
            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className={cn(
                    "flex items-center justify-center bg-white hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-black",
                    sizes.button
                )}
                aria-label="Increase quantity"
            >
                <Plus className={sizes.icon} />
            </button>
        </div>
    )
}
