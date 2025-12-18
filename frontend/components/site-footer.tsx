"use client"

import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"

const footerLinks = {
  shop: ["New Arrivals", "Best Sellers", "Collections", "Sale"],
  help: ["FAQ", "Shipping", "Returns", "Size Guide"],
  about: ["Our Story", "Careers", "Press", "Contact"],
}

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-mono text-3xl font-bold tracking-tighter">
              BRUTAL<span className="text-primary">.</span>
            </Link>
            <p className="text-white/60 mt-4 font-medium text-sm leading-relaxed">
              Bold designs for bold people. Making waves since 2020.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { id: 'instagram', name: 'Instagram', Icon: Instagram, href: 'https://instagram.com' },
                { id: 'twitter', name: 'Twitter', Icon: Twitter, href: 'https://twitter.com' },
                { id: 'youtube', name: 'YouTube', Icon: Youtube, href: 'https://youtube.com' },
              ].map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.name} page`}
                  className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-secondary hover:text-black hover:border-secondary transition-colors rounded-lg"
                >
                  <social.Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-secondary">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-white/60 hover:text-white font-medium text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t-2 border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm font-medium">© 2025 BRUTAL. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-white/40 hover:text-white transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors font-medium">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
