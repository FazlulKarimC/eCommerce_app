import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

const products = [
  {
    name: "OVERSIZED TEE",
    price: 89,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    badge: "SALE",
    badgeColor: "bg-primary",
  },
  {
    name: "CARGO PANTS",
    price: 149,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    badge: "NEW",
    badgeColor: "bg-secondary",
  },
  {
    name: "BOMBER JACKET",
    price: 249,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    badge: null,
  },
  {
    name: "BUCKET HAT",
    price: 59,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=500&fit=crop",
    badge: "HOT",
    badgeColor: "bg-primary",
  },
]

export function ProductsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            FEATURED <span className="inline-block bg-secondary px-3 border-4 border-black">DROPS</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Our most wanted pieces, curated for the bold.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div key={product.name} className={`group ${index % 2 === 1 ? "md:translate-y-4" : ""}`}>
              <div className="relative border-4 border-black bg-muted shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-black font-mono text-xs font-bold px-3 py-1 border-2 border-black -rotate-3`}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Image */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Quick Add Button */}
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity border-4 border-black shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="font-black text-sm md:text-base">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-bold text-lg">${product.price}</span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="font-bold text-lg px-12 py-6 border-4 border-black bg-white shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-secondary transition-all"
          >
            VIEW ALL PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  )
}
