import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-block bg-primary text-white font-mono text-sm font-bold px-4 py-2 border-4 border-black shadow-md mb-6 -rotate-2">
              NEW COLLECTION 2025
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-6">
              BOLD<span className="text-primary">.</span>
              <br />
              BRUTAL<span className="text-primary">.</span>
              <br />
              <span className="inline-block bg-black text-secondary px-4 py-1">BEAUTIFUL</span>
            </h1>

            <p className="text-lg md:text-xl font-medium max-w-md mb-8 border-l-4 border-black pl-4">
              Unapologetically bold designs for those who refuse to blend in. Make a statement.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="font-bold text-lg px-8 py-6 border-4 border-black shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                SHOP NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-bold text-lg px-8 py-6 border-4 border-black bg-white shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-white transition-all"
              >
                EXPLORE
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative bg-white border-4 border-black shadow-lg p-4 rotate-2 hover:rotate-0 transition-transform duration-300">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop"
                alt="Featured collection model"
                width={500}
                height={600}
                className="w-full h-auto border-4 border-black"
              />
              {/* Price Tag */}
              <div className="absolute -bottom-4 -left-4 bg-primary text-white font-mono font-bold px-4 py-2 border-4 border-black shadow-xs -rotate-6">
                FROM $89
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-black hidden lg:block" />
            <div className="absolute -bottom-8 right-12 w-16 h-16 bg-primary border-4 border-black hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Bottom Border Pattern */}
      <div className="h-4 bg-black" />
    </section>
  )
}
