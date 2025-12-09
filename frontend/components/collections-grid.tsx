import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const collections = [
  {
    title: "STREETWEAR",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500&h=500&fit=crop",
    color: "bg-secondary",
    items: "124 Items",
  },
  {
    title: "ESSENTIALS",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop",
    color: "bg-primary",
    textColor: "text-white",
    items: "89 Items",
  },
  {
    title: "ACCESSORIES",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&h=500&fit=crop",
    color: "bg-black",
    textColor: "text-white",
    items: "56 Items",
  },
]

export function CollectionsGrid() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-black text-secondary font-mono text-sm font-bold px-3 py-1 mb-3">
              CURATED
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">COLLECTIONS</h2>
          </div>
          <Link
            href="#"
            className="hidden md:flex items-center gap-2 font-bold border-b-4 border-black pb-1 hover:border-primary transition-colors"
          >
            VIEW ALL <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.title}
              href="#"
              className={`group relative border-4 border-black shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all overflow-hidden ${index === 1 ? "md:-translate-y-4" : ""
                }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Solid Color Overlay */}
                <div className={`absolute inset-0 ${collection.color} opacity-80 mix-blend-multiply`} />

                {/* Content */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col justify-between ${collection.textColor || "text-black"}`}
                >
                  <div className="self-end">
                    <div className="w-12 h-12 border-4 border-current flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold mb-1">{collection.items}</p>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter">{collection.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <Link
          href="#"
          className="md:hidden flex items-center justify-center gap-2 font-bold mt-8 py-4 border-4 border-black bg-white shadow-xs"
        >
          VIEW ALL COLLECTIONS <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
