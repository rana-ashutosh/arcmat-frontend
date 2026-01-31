"use client"
import React, { useState, useMemo } from "react";
import Header from "@/components/layouts/Header";
import Navbar from "@/components/navbar/navbar";
import ProductFilterBar from "@/components/sections/ProductFilterBar";
import ProductSidebar from "@/components/sections/ProductSidebar";
import ProductCard from "@/components/cards/ProductCard";
import Container from "@/components/ui/Container";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useGetProducts } from "@/hooks/useProduct";
import { Loader2 } from "lucide-react";

export default function ProductListPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState(15);
    const [activeFilters, setActiveFilters] = useState({
        brands: [],
        colors: [],
        availability: [],
        toggles: {
            commercial: false,
            residential: false,
            allColorways: false
        }
    });

    const { data: apiData, isLoading } = useGetProducts();
    const products = apiData?.data?.data || [];

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== "All") {
            result = result.filter(p => {
                const name = p.product_name || p.name || '';
                const brand = p.brand || '';
                const subtitle = p.sort_description || p.subtitle || '';

                // Allow filtering by checking if selectedCategory matches name, brand, subtitle 
                // OR exists in the parent_category array
                const inStaticFields = name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                    brand.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                    subtitle.toLowerCase().includes(selectedCategory.toLowerCase());

                const categories = Array.isArray(p.parent_category) ? p.parent_category : [];
                const inCategories = categories.some(cat => String(cat).toLowerCase() === selectedCategory.toLowerCase());

                return inStaticFields || inCategories;
            });
        }

        if (activeFilters.brands.length > 0) {
            result = result.filter(p => activeFilters.brands.includes(p.brand));
        }

        return result;
    }, [products, selectedCategory, activeFilters]);

    const displayedProducts = useMemo(() => {
        return filteredAndSortedProducts.slice(0, visibleItems);
    }, [filteredAndSortedProducts, visibleItems]);

    return (
        <div className="min-h-screen">
            <Header />
            <Navbar />
            <div className="sticky top-16 z-40">
                <ProductFilterBar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onOpenFilters={() => setDrawerOpen(true)}
                />
            </div>

            <Container className="flex gap-4 lg:gap-8 py-6">
                <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-200px)] sticky top-48 overflow-y-auto no-scrollbar pb-10">
                    <ProductSidebar
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                    />
                </div>

                <main className="flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#e09a74] animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8">
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
                            <Button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setActiveFilters({ brands: [], colors: [], availability: [], toggles: { commercial: false, residential: false, allColorways: false } });
                                }}
                                className="mt-4 text-[#e09a74] font-semibold hover:underline"
                            >
                                Clear all filters
                            </Button>
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
                                setActiveFilters={setActiveFilters}
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

            <Footer />
        </div>
    );
}
