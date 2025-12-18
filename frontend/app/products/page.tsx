"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useProducts, useCategories } from "@/lib/hooks"

const genders = [
    { label: "All", value: "all" },
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
    { label: "Unisex", value: "unisex" },
]

const priceRanges = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "Over $200", min: 200, max: undefined },
]

function FilterSidebar({
    categories,
    selectedGender,
    setSelectedGender,
    selectedCategory,
    setSelectedCategory,
    selectedPriceRange,
    setSelectedPriceRange,
}: {
    categories: Array<{ id: string; name: string; slug: string; _count?: { products: number } }> | undefined
    selectedGender: string
    setSelectedGender: (gender: string) => void
    selectedCategory: string
    setSelectedCategory: (cat: string) => void
    selectedPriceRange: string | null
    setSelectedPriceRange: (range: string | null) => void
}) {
    return (
        <div className="space-y-8">
            {/* Gender */}
            <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-4">Gender</h3>
                <div className="flex flex-wrap gap-2">
                    {genders.map((gender) => (
                        <button
                            key={gender.value}
                            onClick={() => setSelectedGender(gender.value)}
                            className={`px-4 py-2 text-sm font-bold border-4 border-black rounded-lg transition-all duration-200 ${selectedGender === gender.value
                                ? "bg-[#0066ff] text-white shadow-[4px_4px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                                : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                                }`}
                        >
                            {gender.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-4 py-2 text-sm font-bold border-4 border-black rounded-lg transition-all duration-200 ${selectedCategory === "All"
                            ? "bg-black text-white shadow-[4px_4px_0px_0px_#FFEB3B] -translate-x-0.5 -translate-y-0.5"
                            : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                            }`}
                    >
                        All
                    </button>
                    {categories?.filter((cat) => !['men', 'women'].includes(cat.slug.toLowerCase())).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-4 py-2 text-sm font-bold border-4 border-black rounded-lg transition-all duration-200 ${selectedCategory === cat.slug
                                ? "bg-black text-white shadow-[4px_4px_0px_0px_#FFEB3B] -translate-x-0.5 -translate-y-0.5"
                                : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                                }`}
                        >
                            {cat.name}
                            {cat._count?.products !== undefined && (
                                <span className="ml-1 text-xs opacity-70">({cat._count.products})</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
                <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => setSelectedPriceRange(selectedPriceRange === range.label ? null : range.label)}
                            className={`px-4 py-2 text-sm font-bold border-4 border-black rounded-lg transition-all duration-200 ${selectedPriceRange === range.label
                                ? "bg-[#FF3B30] text-white shadow-[4px_4px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                                : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProductsPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const searchQuery = searchParams?.get("search") || ""
    const [selectedGender, setSelectedGender] = useState("all")
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams?.get("category") || "All"
    )
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState("featured")
    const [currentPage, setCurrentPage] = useState(1)

    // Parse sort value to API parameters  
    const getSortParams = () => {
        switch (sortBy) {
            case "price-low":
                return { sort: "price" as const, order: "asc" as const }
            case "price-high":
                return { sort: "price" as const, order: "desc" as const }
            case "newest":
                return { sort: "createdAt" as const, order: "desc" as const }
            case "featured":
                return { sort: "featured" as const, order: "desc" as const }
            default:
                return { sort: "createdAt" as const, order: "desc" as const }
        }
    }

    // Get price range values
    const getPriceRange = () => {
        const range = priceRanges.find((r) => r.label === selectedPriceRange)
        if (!range) return { minPrice: undefined, maxPrice: undefined }
        return { minPrice: range.min, maxPrice: range.max }
    }

    // Combine gender and category for API
    const getCategory = () => {
        // If both gender and category are selected, use category
        // Gender acts as a top-level filter (maps to category slugs like 'men', 'women')
        if (selectedCategory !== "All") return selectedCategory
        if (selectedGender !== "all") return selectedGender
        return undefined
    }

    const { sort, order } = getSortParams()
    const { minPrice, maxPrice } = getPriceRange()

    const { data, isLoading } = useProducts({
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        category: getCategory(),
        sort,
        order,
        minPrice,
        maxPrice,
    })

    const { data: categories } = useCategories()

    const products = data?.products || []
    const pagination = data?.pagination

    const activeFilters = [
        searchQuery ? `Search: "${searchQuery}"` : null,
        selectedGender !== "all" ? genders.find(g => g.value === selectedGender)?.label : null,
        selectedCategory !== "All" ? selectedCategory : null,
        selectedPriceRange,
    ].filter(Boolean)

    const clearSearch = () => {
        // Navigate to /products without search param to clear it
        router.push('/products')
    }

    const clearFilters = () => {
        setSelectedGender("all")
        setSelectedCategory("All")
        setSelectedPriceRange(null)
        setCurrentPage(1)
        // If there's a search query, clear it by navigating
        if (searchQuery) {
            router.push('/products')
        }
    }

    // Reset to page 1 when filters change
    const handleGenderChange = (gender: string) => {
        setSelectedGender(gender)
        // Reset category when changing gender for cleaner UX
        setSelectedCategory("All")
        setCurrentPage(1)
    }

    // Reset to page 1 when filters change
    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat)
        setCurrentPage(1)
    }

    const handlePriceRangeChange = (range: string | null) => {
        setSelectedPriceRange(range)
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="inline-block bg-[#FFEB3B] text-black font-mono text-sm font-bold px-4 py-2 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] -rotate-2">
                            {searchQuery ? "SEARCH" : "SHOP"}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black uppercase">
                            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                        </h1>
                    </div>
                    <div className="h-2 w-32 bg-black rounded-full" />
                    <p className="mt-4 text-lg text-gray-600 max-w-xl">
                        {searchQuery
                            ? `Showing products matching your search.`
                            : "Bold pieces for bold people. Browse our collection of brutally beautiful essentials."}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_#000]">
                            <h2 className="font-black text-xl uppercase mb-6 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </h2>
                            <FilterSidebar
                                categories={categories}
                                selectedGender={selectedGender}
                                setSelectedGender={handleGenderChange}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={handleCategoryChange}
                                selectedPriceRange={selectedPriceRange}
                                setSelectedPriceRange={handlePriceRangeChange}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                {/* Mobile Filter Button */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="lg:hidden border-4 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all bg-transparent"
                                        >
                                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 border-r-4 border-black">
                                        <SheetHeader>
                                            <SheetTitle className="font-black text-xl uppercase">Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterSidebar
                                                categories={categories}
                                                selectedGender={selectedGender}
                                                setSelectedGender={handleGenderChange}
                                                selectedCategory={selectedCategory}
                                                setSelectedCategory={handleCategoryChange}
                                                selectedPriceRange={selectedPriceRange}
                                                setSelectedPriceRange={handlePriceRangeChange}
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Product Count */}
                                <span className="bg-black text-white font-mono text-sm px-4 py-2 rounded-lg">
                                    {pagination?.total || 0} Products
                                </span>
                            </div>

                            {/* Sort Dropdown */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-48 border-4 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="border-4 border-black rounded-lg">
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm font-bold text-gray-600">Active:</span>
                                {activeFilters.map((filter) => (
                                    <span
                                        key={filter}
                                        className="inline-flex items-center gap-1 bg-[#FFEB3B] text-black text-sm font-bold px-3 py-1 border-2 border-black rounded-lg"
                                    >
                                        {filter}
                                        <button
                                            onClick={() => {
                                                // Check if filter is a search filter
                                                if (filter?.toString().startsWith('Search:')) {
                                                    clearSearch()
                                                    return
                                                }
                                                // Check if filter is a gender label
                                                const matchedGender = genders.find(g => g.label === filter)
                                                if (matchedGender) handleGenderChange("all")
                                                if (filter === selectedCategory) handleCategoryChange("All")
                                                if (filter === selectedPriceRange) handlePriceRangeChange(null)
                                            }}
                                            className="hover:bg-black hover:text-[#FFEB3B] rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <button onClick={clearFilters} className="text-sm font-bold text-[#FF3B30] hover:underline">
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] rounded-xl animate-pulse">
                                        <div className="aspect-3/4 bg-gray-200" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-200 w-3/4 rounded" />
                                            <div className="h-4 bg-gray-200 w-1/2 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000]">
                                <div className="text-6xl mb-4">:(</div>
                                <h3 className="text-2xl font-black uppercase mb-2">No Products Found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
                                <Button
                                    onClick={clearFilters}
                                    className="bg-[#FFEB3B] text-black font-bold border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 flex items-center justify-center border-4 border-black rounded-lg font-bold bg-white shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000]"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                                    // Calculate which page numbers to show
                                    let pageNum: number
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-12 h-12 flex items-center justify-center border-4 border-black rounded-lg font-bold transition-all ${currentPage === pageNum
                                                ? "bg-black text-white shadow-[4px_4px_0px_0px_#FFEB3B]"
                                                : "bg-white shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                    className="w-12 h-12 flex items-center justify-center border-4 border-black rounded-lg font-bold bg-white shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000]"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

// Wrapper with Suspense for useSearchParams
export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#FAFAFA]">
                    <div className="container mx-auto px-4 py-16">
                        <div className="animate-pulse">
                            <div className="h-12 w-64 bg-gray-200 mb-8 rounded" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="border-4 border-black rounded-xl">
                                        <div className="aspect-3/4 bg-gray-200" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-200 w-3/4 rounded" />
                                            <div className="h-4 bg-gray-200 w-1/2 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <ProductsPageContent />
        </Suspense>
    )
}
