"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { getProductImageUrl, getVariantImageUrl, getColorCode, resolvePricing, calculateDiscount } from '@/lib/productUtils'
import { Heart } from 'lucide-react'
import { useAddToWishlist, useGetWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product }) => {
    const isVariantCentric = Boolean(product.productId && typeof product.productId === 'object');
    const rootProduct = isVariantCentric ? product.productId : product;
    const variantItem = isVariantCentric ? product : null;

    const name = rootProduct.product_name || rootProduct.name;
    const brand = rootProduct.brand;
    const subtitle = rootProduct.sort_description || rootProduct.subtitle;
    const id = rootProduct._id || rootProduct.id;

    const variants = rootProduct.variants || [];
    const displayVariant = variantItem || (variants.find(v => v.selling_price === rootProduct.minPrice) || variants[0]);

    // Pricing Logic
    const { price, mrp } = resolvePricing(rootProduct, displayVariant);
    const discountPercentage = calculateDiscount(mrp, price);

    const displayAttrs = [];
    if (displayVariant?.color) displayAttrs.push({ label: 'Color', value: displayVariant.color });
    if (displayVariant?.size) displayAttrs.push({ label: 'Size', value: displayVariant.size });
    if (displayVariant?.weight) {
        displayAttrs.push({
            label: 'Weight',
            value: `${displayVariant.weight} ${displayVariant.weight_type || ''}`
        });
    }

    const rawImages = displayVariant?.variant_images?.length > 0
        ? displayVariant.variant_images
        : (rootProduct.product_images?.length > 0
            ? rootProduct.product_images
            : (Array.isArray(rootProduct.images) ? rootProduct.images : [rootProduct.image || rootProduct.product_image1].filter(Boolean)));

    const images = rawImages.map(img =>
        displayVariant?.variant_images?.includes(img)
            ? getVariantImageUrl(img)
            : getProductImageUrl(img)
    ).filter(Boolean);

    const swiperRef = React.useRef(null);
    const hasMultipleImages = images.length > 1;
    const [isAdded, setIsAdded] = React.useState(false);

    const { mutate: addToWishlist } = useAddToWishlist();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const { data: wishlistData } = useGetWishlist(isAuthenticated);

    const wishlistItems = wishlistData?.data?.data || [];
    const isInWishlist = wishlistItems.some(item =>
        (isVariantCentric && item.product_variant_id?._id === variantItem?._id) ||
        (!isVariantCentric && item.product_id?._id === rootProduct?._id)
    );

    const [isWishlisted, setIsWishlisted] = React.useState(isInWishlist);

    React.useEffect(() => {
        setIsWishlisted(isInWishlist);
    }, [isInWishlist]);

    const handleAddToCart = () => {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        addToWishlist({
            product_id: rootProduct?._id,
            product_variant_id: variantItem?._id || null,
            item_or_variant: isVariantCentric ? 'variant' : 'item'
        });
        setIsWishlisted(true);
    };

    return (
        <div
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 p-3"
            onMouseEnter={() => swiperRef.current?.autoplay?.start()}
            onMouseLeave={() => {
                swiperRef.current?.autoplay?.stop()
                swiperRef.current?.slideTo(0)
            }}
        >
            <Link href={`/productdetails/${id}${variantItem ? `?variantId=${variantItem._id}` : ''}`} className="block">
                <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    {images.length > 0 ? (
                        hasMultipleImages ? (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 1500,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper
                                    swiper.autoplay.stop()
                                }}
                                className="h-full w-full product-card-swiper cursor-pointer"
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <Image
                                            src={img}
                                            alt={name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <Image
                                src={images[0] || null}
                                alt={name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {(rootProduct.isNew || rootProduct.newarrivedproduct === "Active" || rootProduct.newarrivedproduct === 1) && (
                        <div className="absolute top-2 left-2 bg-[#e09a74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            New
                        </div>
                    )}
                    {(rootProduct.trendingproduct === "Active" || rootProduct.trendingproduct === 1) && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            Trending
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 px-3">
                    <h4 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wider mb-0.5 group-hover:text-[#e09a74] transition-colors">{name}</h4>
                    <h3 className="text-[9px] font-semibold text-gray-400 leading-tight mb-1 ">
                        {rootProduct.createdBy?.name ||
                            (rootProduct.createdBy?.first_name ? `${rootProduct.createdBy.first_name} ${rootProduct.createdBy.last_name || ''}` : null) ||
                            rootProduct.vendorName ||
                            (typeof brand === 'object' ? (brand.name || brand.brand_name) : brand) ||
                            'Unknown Vendor'}
                    </h3>

                    {displayAttrs.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-1.5 opacity-80">
                            {displayAttrs.map((attr, idx) => {
                                const isColor = attr.label.toLowerCase() === 'color'
                                const colorCode = isColor ? getColorCode(attr.value) : null

                                return (
                                    <span key={idx} className="text-[9px] text-gray-500 font-medium whitespace-nowrap flex items-center gap-1">
                                        {!isColor && <>{attr.label}: </>}
                                        {isColor && colorCode && (
                                            <span
                                                className="w-3 h-3 rounded-full border border-gray-100 shadow-sm"
                                                style={{ backgroundColor: colorCode }}
                                                title={attr.value}
                                            />
                                        )}
                                        {!isColor && <span className="text-gray-800">{attr.value}</span>}
                                        {idx < displayAttrs.length - 1 && <span className="ml-2 text-gray-300">|</span>}
                                    </span>
                                )
                            })}
                        </div>
                    )}

                    <p className="text-[12px] font-normal text-gray-500 mb-2 line-clamp-1">{subtitle}</p>

                    <div className="flex items-center gap-2 mb-4">
                        {price && (
                            <span className="text-[14px] font-bold text-[#e09a74]">₹{price.toLocaleString()}</span>
                        )}
                        {mrp && mrp > price && (
                            <>
                                <span className="text-[11px] text-gray-400 line-through">₹{mrp.toLocaleString()}</span>
                                <span className="text-[10px] font-bold text-green-600">-{discountPercentage}%</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            <div className="px-3 flex gap-2">
                <Button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 shadow-sm transform active:scale-95 transition-all text-[11px] font-bold border ${isAdded
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-[#e09a74] border-[#e09a74] text-white hover:bg-white hover:text-[#e09a74]'
                        }`}
                >
                    {!isAdded && <Image src="/Icons/Add Shopping Cart.svg" width={14} height={14} alt="" />}
                    <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                </Button>

                <button
                    onClick={handleWishlist}
                    className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>

            <style jsx global>{`
                .product-card-swiper .swiper-pagination-bullet {
                    width: 6px;
                    height: 6px;
                    background: #fff;
                    opacity: 0.6;
                }
                .product-card-swiper .swiper-pagination-bullet-active {
                    background: #e09a74;
                    opacity: 1;
                    width: 14px;
                    border-radius: 4px;
                }
                .product-card-swiper .swiper-pagination {
                    bottom: 8px !important;
                }
            `}</style>
        </div>
    )
}

export default ProductCard
