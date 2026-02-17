"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCompareStore } from '@/store/useCompareStore'
import { X, ArrowRightLeft } from 'lucide-react'
import { getProductImageUrl, getVariantImageUrl } from '@/lib/productUtils'

const CompareBar = () => {
    const comparedProducts = useCompareStore(state => state.comparedProducts);
    const removeProduct = useCompareStore(state => state.removeProduct);
    const clearAll = useCompareStore(state => state.clearAll);
    const openCompareModal = useCompareStore(state => state.openCompareModal);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || comparedProducts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 flex items-center gap-4">
                <div className="flex -space-x-4 overflow-hidden flex-1 pl-2">
                    {comparedProducts.map((product) => {
                        const isVariant = Boolean(product.productId && typeof product.productId === 'object');
                        const root = isVariant ? product.productId : product;
                        const variantImages = Array.isArray(product.variant_images) ? product.variant_images : [];
                        const rootImages = Array.isArray(root.product_images) ? root.product_images : [];
                        const image = variantImages[0] || rootImages[0] || root.image || root.product_image1;
                        const imageUrl = variantImages.includes(image) ? getVariantImageUrl(image) : getProductImageUrl(image);

                        return (
                            <div key={product._id || product.id} className="relative group">
                                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-50 shadow-sm relative">
                                    <Image
                                        src={imageUrl}
                                        alt={root.product_name || root.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <button
                                    onClick={() => removeProduct(product._id || product.id)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )
                    })}
                    {comparedProducts.length < 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                            +{3 - comparedProducts.length}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pr-2">
                    <button
                        onClick={clearAll}
                        className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={openCompareModal}
                        disabled={comparedProducts.length < 2}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${comparedProducts.length >= 2
                            ? 'bg-[#e09a74] text-white hover:shadow-lg active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <ArrowRightLeft className="w-4 h-4" />
                        Compare Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CompareBar
