import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { useGetCategories } from '@/hooks/useCategory'
import { useCompareStore } from '@/store/useCompareStore'
import { Loader2 } from 'lucide-react'

const ProductFilterBar = ({ selectedCategory, setSelectedCategory, onOpenFilters, categoryCounts = {} }) => {
    const { data: categoriesData, isLoading } = useGetCategories({ level: 1 });

    const dynamicCategories = useMemo(() => {
        if (!categoriesData) return [{ name: 'All', id: 'All', count: categoryCounts['All'] }];

        const uniqueNames = new Set();
        const filtered = categoriesData.filter(cat => {
            const isDuplicate = uniqueNames.has(cat.name);
            uniqueNames.add(cat.name);
            return !isDuplicate;
        });

        const mapped = filtered.map(cat => ({
            name: cat.name,
            id: cat._id || cat.id,
            count: categoryCounts[cat._id || cat.id] || 0
        }));

        return [{ name: 'All', id: 'All', count: categoryCounts['All'] }, ...mapped];
    }, [categoriesData, categoryCounts]);

    const comparedCount = useCompareStore(state => state.comparedProducts.length);
    const openCompareModal = useCompareStore(state => state.openCompareModal);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="bg-white border-b-2 border-gray-200 py-3">

            <Container className="flex items-center gap-2 sm:gap-4">

                <Button
                    onClick={onOpenFilters}
                    className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0 cursor-pointer">
                    <Image src="/Icons/Vector.svg" width={18} height={18} alt="Vector" />
                    <span className="hidden sm:inline text-[15px] font-medium">Filters</span>
                </Button>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scroll-smooth py-1 px-1">
                        {isLoading ? (
                            <div className="flex items-center gap-2 px-4 py-2">
                                <Loader2 className="w-4 h-4 text-[#e09a74] animate-spin" />
                                <span className="text-sm text-gray-400">Loading categories...</span>
                            </div>
                        ) : (
                            dynamicCategories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all text-[14px] sm:text-[15px] cursor-pointer ${selectedCategory === cat.id
                                        ? 'bg-[#e09a74] text-white shadow-sm font-semibold'
                                        : 'bg-[#f3f4f6] text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    {cat.count && (
                                        <span className={`text-[12px] px-2 py-0.5 rounded-full font-bold ${selectedCategory === cat.id ? 'bg-black/20 text-white' : 'bg-gray-400 text-white'
                                            }`}>
                                            {cat.count}
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0">

                    <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-1"></div>

                    <Button
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer relative"
                    >
                        <Image src="/Icons/Search.svg" width={20} height={20} alt="Search" className="opacity-60" />
                    </Button>

                    <Button
                        className="p-2 flex sm:hidden hover:bg-gray-50 rounded-full transition-colors relative"
                    >
                        <Image src="/Icons/Vector_2.svg" width={15} height={15} alt="Search" className="opacity-60" />
                    </Button>

                    <Button
                        onClick={() => openCompareModal()}
                        className="hidden sm:block ml-1 sm:ml-2 px-4 sm:px-7 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-[#e09a74] hover:text-white transition-colors text-[14px] sm:text-[15px] font-bold text-gray-700 shadow-sm cursor-pointer whitespace-nowrap"
                    >
                        Compare {mounted && comparedCount > 0 && `(${comparedCount})`}
                    </Button>
                </div>

            </Container>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

        </section>
    )
}

export default ProductFilterBar
