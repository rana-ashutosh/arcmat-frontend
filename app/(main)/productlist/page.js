"use client"
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductFilterBar from "@/components/sections/ProductFilterBar";
import ProductSidebar from "@/components/sections/ProductSidebar";
import ProductCard from "@/components/cards/ProductCard";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useGetVariants } from "@/hooks/useProduct";
import { useGetVendors } from "@/hooks/useVendor";
import { resolvePricing, formatCurrency } from "@/lib/productUtils";
import { Loader2 } from "lucide-react";
import CompareBar from "@/components/ui/CompareBar";
import CompareModal from "@/components/ui/CompareModal";
import { parseFiltersFromURL, buildURLFromFilters } from "@/lib/urlParamsUtils";

export default function ProductListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState(15);
    const [activeFilters, setActiveFilters] = useState({
        brands: [],
        colors: [],
        availability: [],
        priceRange: [0, 500000],
        toggles: {
            commercial: false,
            residential: false,
            allColorways: false
        }
    });

    const [isInitialized, setIsInitialized] = useState(false);

    const { data: apiData, isLoading } = useGetVariants({
        status: 1,
        limit: 1000,
    });

    const { data: brandsData } = useGetVendors({ type: 'frontend' });
    const brands = Array.isArray(brandsData) ? brandsData : (brandsData?.data || []);

    const products = apiData?.data?.data || [];

    const { minPrice, maxPrice, priceStep } = useMemo(() => {
        if (!products.length) return { minPrice: 0, maxPrice: 100000, priceStep: 1000 };
        const prices = products.map(p => resolvePricing(p).price).filter(p => p > 0);
        const min = Math.floor(Math.min(...prices) / 100) * 100;
        const max = Math.ceil(Math.max(...prices) / 100) * 100;
        return { minPrice: min, maxPrice: max, priceStep: 100 };
    }, [products]);

    useEffect(() => {
        const parsed = parseFiltersFromURL(searchParams);
        setSelectedCategory(parsed.category);
        setActiveFilters(parsed.filters);
        setIsInitialized(true);
    }, [searchParams]);

    useEffect(() => {
        if (products.length && activeFilters.priceRange[1] === 500000 && isInitialized) {
            setActiveFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
        }
    }, [products, minPrice, maxPrice, isInitialized]);

    const updateURL = (newCategory, newFilters) => {
        if (!isInitialized) return;

        const params = buildURLFromFilters(newCategory, newFilters);
        const newUrl = params ? `${pathname}?${params}` : pathname;
        router.push(newUrl, { scroll: false });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        updateURL(categoryId, activeFilters);
    };
    const handleFiltersChange = (newFiltersOrCallback) => {
        const newFilters = typeof newFiltersOrCallback === 'function'
            ? newFiltersOrCallback(activeFilters)
            : newFiltersOrCallback;

        setActiveFilters(newFilters);
        updateURL(selectedCategory, newFilters);
    };

    const filteredAndSortedProducts = useMemo(() => {
        return products.filter(variant => {
            const rootProduct = variant.productId;
            if (!rootProduct) return false;

            const { price } = resolvePricing(variant);

            if (price < activeFilters.priceRange[0] || price > activeFilters.priceRange[1]) {
                if (price > 0) return false;
            }

            if (selectedCategory !== "All") {
                const catMatch =
                    rootProduct.categoryId === selectedCategory ||
                    rootProduct.categoryId?._id === selectedCategory ||
                    rootProduct.subcategoryId === selectedCategory ||
                    rootProduct.subcategoryId?._id === selectedCategory ||
                    rootProduct.subsubcategoryId === selectedCategory ||
                    rootProduct.subsubcategoryId?._id === selectedCategory;

                if (!catMatch) return false;
            }

            if (activeFilters.brands.length > 0) {
                const brandId = rootProduct.brand?._id || rootProduct.brand;
                if (!activeFilters.brands.includes(brandId)) return false;
            }

            if (activeFilters.colors.length > 0) {
                if (!activeFilters.colors.includes(variant.color)) return false;
            }

            return true;
        });
    }, [products, selectedCategory, activeFilters]);

    const displayedProducts = useMemo(() => {
        return filteredAndSortedProducts.slice(0, visibleItems);
    }, [filteredAndSortedProducts, visibleItems]);

    const categoryCounts = useMemo(() => {
        const counts = { All: products.length };
        products.forEach(variant => {
            const rootProduct = variant.productId;
            if (!rootProduct) return;

            [rootProduct.categoryId, rootProduct.subcategoryId, rootProduct.subsubcategoryId].forEach(cat => {
                const id = cat?._id || cat;
                if (id) {
                    counts[id] = (counts[id] || 0) + 1;
                }
            });
        });
        return counts;
    }, [products]);

    const availableColors = useMemo(() => {
        const colors = new Set();
        products.forEach(variant => {
            if (variant.color) colors.add(variant.color);
        });
        return Array.from(colors).sort();
    }, [products]);

    return (
        <div className="min-h-screen">
            <div className="sticky top-16 z-40">
                <ProductFilterBar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={handleCategoryChange}
                    onOpenFilters={() => setDrawerOpen(true)}
                    categoryCounts={categoryCounts}
                />
            </div>

            <Container className="flex gap-4 lg:gap-8 py-6">
                <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-200px)] sticky top-48 overflow-y-auto no-scrollbar pb-10">
                    <ProductSidebar
                        activeFilters={activeFilters}
                        setActiveFilters={handleFiltersChange}
                        brands={brands}
                        availableColors={availableColors}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        priceStep={priceStep}
                    />
                </div>

                <main className="flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#e09a74] animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-4 gap-y-8">
                            {displayedProducts.map((product, i) => (
                                <ProductCard key={product._id || product.id || i} product={product} />
                            ))}
                        </div>
                    )}

                    {displayedProducts.length < filteredAndSortedProducts.length && (
                        <div className="flex justify-center mt-12 mb-8">
                            <Button
                                text="Load more products"
                                onClick={() => setVisibleItems(prev => prev + 10)}
                                className="px-10 py-3 border-2 border-gray-200 rounded-2xl font-bold bg-[#e09a74] hover:bg-white hover:border-[#e09a74] text-white hover:text-[#e09a74] transition-all transform active:scale-95 shadow-sm"
                            >
                            </Button>
                        </div>
                    )}

                    {filteredAndSortedProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                            <p className="text-xl font-medium text-gray-500">Coming Soon</p>
                        </div>
                    )}
                </main>
            </Container>

            <div
                className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setDrawerOpen(false)}
                />
                <div
                    className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <Button
                                onClick={() => setDrawerOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <Image src="Icons/icons8-close.svg" alt="Close" width="20" height="20" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <ProductSidebar
                                activeFilters={activeFilters}
                                setActiveFilters={handleFiltersChange}
                                brands={brands}
                                availableColors={availableColors}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                priceStep={priceStep}
                            />
                        </div>
                        <div className="p-4 border-t">
                            <Button
                                text="Show Results"
                                onClick={() => setDrawerOpen(false)}
                                className="w-full py-3 bg-[#e09a74] hover:bg-white hover:text-[#e09a74] hover:border-[#e09a74] border text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
                            >
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <CompareBar />
            <CompareModal />
        </div>
    );
}
