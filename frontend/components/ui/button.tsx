import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        // Neo Brutalism variants
        primary:
          "bg-red-500 text-white border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#000]",
        secondary:
          "bg-black text-white border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#000]",
        yellow:
          "bg-yellow-400 text-black border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#000]",
        outline:
          "bg-white text-black border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:bg-yellow-400 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#000]",
        ghost:
          "text-black hover:bg-gray-100 rounded-lg border-0",
        destructive:
          "bg-white text-red-500 border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:bg-red-50 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]",
        link:
          "text-red-500 underline-offset-4 hover:underline border-0",
        // Legacy variants for backwards compatibility
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
