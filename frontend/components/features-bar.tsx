import { Truck, RotateCcw, Shield, Zap } from "lucide-react"

const features = [
  { icon: Truck, label: "FREE SHIPPING", sublabel: "Orders $100+" },
  { icon: RotateCcw, label: "EASY RETURNS", sublabel: "30 Day Policy" },
  { icon: Shield, label: "SECURE PAY", sublabel: "100% Protected" },
  { icon: Zap, label: "FAST DELIVERY", sublabel: "2-3 Days" },
]

export function FeaturesBar() {
  return (
    <section className="bg-white py-8 border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className={`flex items-center gap-3 p-4 border-4 border-black bg-background shadow-xs hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all cursor-default ${
                index % 2 === 0 ? "rotate-1" : "-rotate-1"
              } hover:rotate-0`}
            >
              <div className="bg-secondary p-3 border-4 border-black">
                <feature.icon className="h-6 w-6" strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-sm">{feature.label}</p>
                <p className="text-xs text-muted-foreground font-medium">{feature.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
