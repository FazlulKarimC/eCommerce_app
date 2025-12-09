import { HeroSection } from "@/components/hero-section"
import { FeaturesBar } from "@/components/features-bar"
import { CollectionsGrid } from "@/components/collections-grid"
import { ProductsSection } from "@/components/products-section"
import { NewsletterCTA } from "@/components/newsletter-cta"
import { BrandStory } from "@/components/brand-story"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturesBar />
        <CollectionsGrid />
        <ProductsSection />
        <NewsletterCTA />
        <BrandStory />
      </main>
    </div>
  )
}
