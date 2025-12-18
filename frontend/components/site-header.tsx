"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart"
import { useAuthStore } from "@/lib/auth"

export function SiteHeader() {
  const router = useRouter()
  const { cart, toggleCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Close search on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }
    if (isSearchOpen) {
      window.addEventListener("keydown", handleEscape)
    }
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isSearchOpen])

  return (
    <header className="sticky top-0 z-50 bg-secondary border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-mono text-2xl font-bold tracking-tighter">
            BRUTAL<span className="text-primary">.</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-4 py-2 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-secondary transition-colors border-2 border-transparent hover:border-black rounded-lg"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="px-4 py-2 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-secondary transition-colors border-2 border-transparent hover:border-black rounded-lg"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-secondary transition-colors border-2 border-transparent hover:border-black rounded-lg"
            >
              About
            </Link>
            <Link
              href="/track"
              className="px-4 py-2 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-secondary transition-colors border-2 border-transparent hover:border-black rounded-lg"
            >
              Track Order
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-40 md:w-64 h-9 px-3 bg-white border-2 border-black rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="border-2 border-black bg-black text-white hover:bg-yellow-400 hover:text-black rounded-lg"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                  className="border-2 border-transparent hover:border-black hover:bg-black hover:text-white rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="border-2 border-transparent hover:border-black hover:bg-black hover:text-white rounded-lg"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Link href={isAuthenticated ? "/account" : "/auth/login"}>
              <Button
                variant="ghost"
                size="icon"
                className="border-2 border-transparent hover:border-black hover:bg-black hover:text-white rounded-lg"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="default"
              size="icon"
              onClick={toggleCart}
              className="relative border-2 border-black shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-secondary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden border-2 border-transparent hover:border-black rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
