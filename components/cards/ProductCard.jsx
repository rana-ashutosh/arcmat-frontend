"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { getProductImageUrl } from '@/lib/productUtils'

const ProductCard = ({ product }) => {
    const name = product.product_name || product.name
    const brand = product.brand
    const subtitle = product.sort_description || product.subtitle
    const id = product._id || product.id
    const price = product.selling_price || product.price
    const mrp = product.mrp_price || product.mrp

    const rawImages = product.product_images?.length > 0
        ? product.product_images
        : (Array.isArray(product.images) ? product.images : [product.image || product.product_image1].filter(Boolean));

    const images = rawImages.map(img => getProductImageUrl(img)).filter(Boolean);

    const hasMultipleImages = images.length > 1
    const [currentImageIdx, setCurrentImageIdx] = React.useState(0)
    const [isAdded, setIsAdded] = React.useState(false)

    const handleAddToCart = () => {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 p-3">
            <Link href={`/productdetails/${id}`} className="block">
                <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    {images.length > 0 ? (
                        hasMultipleImages ? (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                onSlideChange={(swiper) => setCurrentImageIdx(swiper.realIndex)}
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
                                src={images[currentImageIdx] || images[0] || null}
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

                    {(product.isNew || product.newarrivedproduct === "Active") && (
                        <div className="absolute top-2 left-2 bg-[#e09a74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            New
                        </div>
                    )}
                    {(product.trendingproduct === "Active") && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            Trending
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 px-3">
                    <div className="flex items-center gap-1.5 mb-3">
                        {images?.map((sv, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (idx < images.length) setCurrentImageIdx(idx)
                                }}
                                className={`w-5 h-5 rounded-md border transition-all overflow-hidden shrink-0 ${currentImageIdx === idx ? 'ring-2 ring-[#e09a74] ring-offset-1 border-transparent' : 'border-gray-200'}`}
                            >
                                <Image src={sv} width={20} height={20} alt="color" className="object-cover w-full h-full" unoptimized />
                            </button>
                        ))}
                        {product.moreVariants && (
                            <span className="text-[11px] font-medium text-gray-500 ml-0.5">{product.moreVariants}</span>
                        )}
                    </div>

                    <h4 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wider mb-0.5 group-hover:text-[#e09a74] transition-colors">{name}</h4>
                    <h3 className="text-[9px] font-semibold text-gray-400 leading-tight mb-1 ">
                        {product.createdBy?.name ||
                            (product.createdBy?.first_name ? `${product.createdBy.first_name} ${product.createdBy.last_name || ''}` : null) ||
                            product.vendorName ||
                            brand ||
                            'Unknown Vendor'}
                    </h3>
                    <p className="text-[12px] font-normal text-gray-500 mb-4 line-clamp-1">{subtitle}</p>
                    {price && (
                        <p className="text-[14px] font-bold text-[#e09a74] mb-2">₹{price}</p>
                    )}
                </div>
            </Link>

            <div className="px-3">
                <Button
                    onClick={handleAddToCart}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2 px-4 shadow-sm transform active:scale-95 transition-all text-[12px] font-semibold border ${isAdded
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-[#e09a74] border-[#e09a74] text-white hover:bg-white hover:text-[#e09a74]'
                        }`}
                >

                    <Image src="/Icons/Add Shopping Cart.svg" width={16} height={16} alt="" />

                    <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                </Button>
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
