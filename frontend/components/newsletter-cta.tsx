"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function NewsletterCTA() {
  return (
    <section className="relative bg-primary py-16 overflow-hidden">
      {/* Zigzag Top Border */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-black"
        style={{
          clipPath:
            "polygon(0 100%, 2% 0, 4% 100%, 6% 0, 8% 100%, 10% 0, 12% 100%, 14% 0, 16% 100%, 18% 0, 20% 100%, 22% 0, 24% 100%, 26% 0, 28% 100%, 30% 0, 32% 100%, 34% 0, 36% 100%, 38% 0, 40% 100%, 42% 0, 44% 100%, 46% 0, 48% 100%, 50% 0, 52% 100%, 54% 0, 56% 100%, 58% 0, 60% 100%, 62% 0, 64% 100%, 66% 0, 68% 100%, 70% 0, 72% 100%, 74% 0, 76% 100%, 78% 0, 80% 100%, 82% 0, 84% 100%, 86% 0, 88% 100%, 90% 0, 92% 100%, 94% 0, 96% 100%, 98% 0, 100% 100%)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-black text-secondary font-mono text-sm font-bold px-4 py-2 border-4 border-black mb-6 rotate-2 rounded-lg">
            JOIN THE MOVEMENT
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            GET 15% OFF YOUR FIRST ORDER
          </h2>

          <p className="text-white/90 font-medium text-lg mb-8 max-w-xl mx-auto">
            Subscribe for exclusive drops, early access, and brutal deals straight to your inbox.
          </p>

          {/* Form */}
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full h-14 px-4 font-bold text-base border-4 border-black bg-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 font-bold text-base bg-black text-secondary border-4 border-black shadow-[4px_4px_0_0_var(--color-secondary)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all rounded-lg"
            >
              SUBSCRIBE
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-white/60 text-sm mt-4 font-medium">No spam. Unsubscribe anytime. We respect your inbox.</p>
        </div>
      </div>

      {/* Zigzag Bottom Border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 bg-black"
        style={{
          clipPath:
            "polygon(0 0, 2% 100%, 4% 0, 6% 100%, 8% 0, 10% 100%, 12% 0, 14% 100%, 16% 0, 18% 100%, 20% 0, 22% 100%, 24% 0, 26% 100%, 28% 0, 30% 100%, 32% 0, 34% 100%, 36% 0, 38% 100%, 40% 0, 42% 100%, 44% 0, 46% 100%, 48% 0, 50% 100%, 52% 0, 54% 100%, 56% 0, 58% 100%, 60% 0, 62% 100%, 64% 0, 66% 100%, 68% 0, 70% 100%, 72% 0, 74% 100%, 76% 0, 78% 100%, 80% 0, 82% 100%, 84% 0, 86% 100%, 88% 0, 90% 100%, 92% 0, 94% 100%, 96% 0, 98% 100%, 100% 0)",
        }}
      />

      <div className="absolute top-1/2 left-8 w-16 h-16 border-4 border-black bg-secondary rotate-12 hidden lg:block rounded-lg" />
      <div className="absolute top-1/3 right-12 w-12 h-12 bg-black -rotate-6 hidden lg:block rounded-lg" />
    </section>
  )
}
