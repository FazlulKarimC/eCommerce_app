import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function BrandStory() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images Stack */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10 border-4 border-black shadow-lg bg-white p-3">
              <Image
                src="/fashion-brand-story-urban-studio-creative-workspac.jpg"
                alt="Our story"
                width={600}
                height={500}
                className="w-full h-auto border-4 border-black"
              />
            </div>

            {/* Secondary Image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-4 border-black shadow-md bg-white p-2 rotate-6 hidden md:block">
              <Image
                src="/fashion-designer-working-creative-process.jpg"
                alt="Creative process"
                width={200}
                height={200}
                className="w-full h-full object-cover border-2 border-black"
              />
            </div>

            {/* Decorative */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary border-4 border-black -z-10 hidden md:block" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="inline-block bg-primary text-white font-mono text-sm font-bold px-4 py-2 border-4 border-black mb-6 -rotate-1">
              OUR STORY
            </span>

            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              BORN FROM
              <br />
              <span className="inline-block bg-black text-secondary px-3 py-1">REBELLION</span>
            </h2>

            {/* Pull Quote */}
            <blockquote className="border-l-8 border-primary pl-6 py-4 mb-6">
              <p className="text-xl md:text-2xl font-bold italic">"We don't follow trends. We break them."</p>
            </blockquote>

            <p className="text-muted-foreground font-medium text-lg mb-6 leading-relaxed">
              Founded in 2020, BRUTAL was born from a simple idea: fashion should be fearless. We design for those who
              refuse to blend in, who see clothing as a statement, not just fabric.
            </p>

            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              Every piece we create is a rebellion against the ordinary. Bold lines, unapologetic colors, and designs
              that demand attention. This is more than fashion—it's a movement.
            </p>

            <Button
              size="lg"
              variant="outline"
              className="font-bold text-lg px-8 py-6 border-4 border-black bg-white shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-secondary transition-all"
            >
              LEARN MORE
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
