"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCompareStore } from '@/store/useCompareStore'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { getProductImageUrl, getVariantImageUrl, getColorCode, formatCurrency, resolvePricing } from '@/lib/productUtils'
import Button from './Button'
import { useAddToCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/useCartStore'
import { toast } from '@/components/ui/Toast'

const CompareModal = () => {
    const isCompareModalOpen = useCompareStore(state => state.isCompareModalOpen);
    const closeCompareModal = useCompareStore(state => state.closeCompareModal);
    const comparedProducts = useCompareStore(state => state.comparedProducts);
    const removeProduct = useCompareStore(state => state.removeProduct);
    const { isAuthenticated } = useAuth();
    const { mutate: addToCartBackend } = useAddToCart();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isCompareModalOpen) return null;

    const handleAddToCart = (product) => {
        const isVariantCentric = Boolean(product.productId && typeof product.productId === 'object');
        const rootProduct = isVariantCentric ? product.productId : product;
        const variantItem = isVariantCentric ? product : null;
        const name = rootProduct.product_name || rootProduct.name;

        if (isAuthenticated) {
            addToCartBackend({
                product_name: name,
                product_id: rootProduct?._id,
                product_qty: 1,
                product_variant_id: variantItem?._id || null,
                item_or_variant: isVariantCentric ? 'variant' : 'item'
            });
        } else {
            const cartItemId = variantItem
                ? `${rootProduct._id}-${variantItem._id}`
                : rootProduct._id;
            useCartStore.getState().addItem(rootProduct, 1, variantItem);
            toast.success(`${name} added to cart!`);
        }
    };

    const allAttrKeysMap = new Map();
    comparedProducts.forEach(p => {
        let attrs = p.dynamicAttributes;
        if (typeof attrs === 'string') {
            try { attrs = JSON.parse(attrs); } catch (e) { attrs = []; }
        }
        if (Array.isArray(attrs)) {
            attrs.forEach(a => {
                const key = a.attributeName || a.key;
                if (key) {
                    const lowKey = key.toLowerCase();
                    if (!allAttrKeysMap.has(lowKey)) {
                        allAttrKeysMap.set(lowKey, key);
                    }
                }
            });
        }
    });
    const allAttrKeys = Array.from(allAttrKeysMap.values());

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCompareModal} />

            <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 fade-in duration-300">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
                    <button
                        onClick={closeCompareModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto no-scrollbar">
                    <div className="min-w-[600px] lg:min-w-[800px]">
                        <div className="grid grid-cols-[200px_1fr] border-b">
                            <div className="bg-gray-50/50 p-6 flex items-center font-bold text-gray-400 uppercase text-xs tracking-wider">Product</div>
                            <div className="h-full grid" style={{ gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(0, 1fr))` }}>
                                {comparedProducts.map((product) => {
                                    const isVariant = Boolean(product.productId && typeof product.productId === 'object');
                                    const root = isVariant ? product.productId : product;
                                    const variantImages = Array.isArray(product.variant_images) ? product.variant_images : [];
                                    const rootImages = Array.isArray(root.product_images) ? root.product_images : [];
                                    const image = variantImages[0] || rootImages[0] || root.image || root.product_image1;
                                    const imageUrl = variantImages.includes(image) ? getVariantImageUrl(image) : getProductImageUrl(image);

                                    return (
                                        <div key={product._id || product.id} className="p-6 border-l flex flex-col items-center group relative">
                                            <button
                                                onClick={() => removeProduct(product._id || product.id)}
                                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="relative w-32 h-32 mb-4 rounded-xl overflow-hidden bg-gray-50 border shadow-sm">
                                                <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900 text-center line-clamp-2 min-h-[40px] uppercase">{root.product_name || root.name}</h3>
                                            <p className="text-[10px] font-bold text-[#e09a74] uppercase tracking-widest mt-1">
                                                {typeof root.brand === 'object' ? (root.brand.name || root.brand.brand_name) : root.brand}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-[200px_1fr] border-b">
                            <div className="bg-gray-50/50 p-6 flex items-center font-bold text-gray-500 text-sm">Price</div>
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(0, 1fr))` }}>
                                {comparedProducts.map((product) => {
                                    const { price, mrp } = resolvePricing(product.productId && typeof product.productId === 'object' ? product.productId : product, product.productId && typeof product.productId === 'object' ? product : null);
                                    return (
                                        <div key={product._id || product.id} className="p-6 border-l flex flex-col justify-center items-center">
                                            <span className="text-lg font-bold text-[#e09a74]">{formatCurrency(price)}</span>
                                            {mrp > price && (
                                                <span className="text-xs text-gray-400 line-through">{formatCurrency(mrp)}</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {allAttrKeys.map((key) => (
                            <div key={key} className="grid grid-cols-[200px_1fr] border-b">
                                <div className="bg-gray-50/50 p-4 flex items-center font-bold text-gray-500 text-sm capitalize">{key}</div>
                                <div className="grid" style={{ gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(0, 1fr))` }}>
                                    {comparedProducts.map((product) => {
                                        let attrs = product.dynamicAttributes;
                                        if (typeof attrs === 'string') {
                                            try { attrs = JSON.parse(attrs); } catch (e) { attrs = []; }
                                        }
                                        const attr = (Array.isArray(attrs) ? attrs : []).find(a => (a.attributeName || a.key)?.toLowerCase() === key.toLowerCase());
                                        return (
                                            <div key={product._id || product.id} className="p-4 border-l flex justify-center items-center text-sm text-gray-700">
                                                {attr?.attributeValue || attr?.value || <span className="text-gray-300">-</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="grid grid-cols-[200px_1fr] border-b">
                            <div className="bg-gray-50/50 p-6 flex items-center font-bold text-gray-500 text-sm">Action</div>
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(0, 1fr))` }}>
                                {comparedProducts.map((product) => (
                                    <div key={product._id || product.id} className="p-6 border-l flex justify-center items-center">
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full h-10 bg-[#e09a74] text-white hover:bg-white hover:text-[#e09a74] border-[#e09a74] border rounded-xl text-xs font-bold"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2 inline-block" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                        Comparing {comparedProducts.length} products
                    </p>
                    <Button
                        onClick={closeCompareModal}
                        className="px-8 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm"
                    >
                        Back to Shopping
                    </Button>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}

export default CompareModal
