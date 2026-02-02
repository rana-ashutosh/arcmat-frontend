"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import RequestInfo from './RequestInfo'
import Link from 'next/link'
import Modal from '@/components/ui/ProductDetailPageModal'
import Container from '../ui/Container'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import { toast } from '../ui/Toast'

const ProductDetailView = ({ product, categories = [], childCategories = [] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [isAdded, setIsAdded] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeRequest, setActiveRequest] = useState({})

    if (!product) return null

    const handleOpenModal = (requestType) => {
        setActiveRequest(requestType)
        setIsModalOpen(true)
    }

    const handleClick = () => {
        toast.info('Coming soon!', 'Stay tuned');
    };

    const name = product.product_name || product.name
    const price = product.selling_price || product.price
    const mrp = product.mrp_price || product.mrp
    const subtitle = product.sort_description || product.subtitle
    const description = product.description

    // Core Boolean Flags
    const hasPrice = Boolean(price && Number(price) > 0)
    const hasMrp = Boolean(mrp && Number(mrp) > 0)
    const stockQuantity = Number(product.stock || product.available_stock || 0)
    const inStock =
        product.stock_status?.toLowerCase().includes('in stock') || stockQuantity > 0
    const isPurchasable = hasPrice && inStock
    const isPremium = product.featuredproduct === 'Active'
    const vendorName = product.createdBy?.name

    // Images
    const images =
        product.product_images?.length
            ? product.product_images.map(img =>
                img.startsWith('http')
                    ? img
                    : `http://localhost:8000/api/public/uploads/product/${img}`
            )
            : [product.product_image1].filter(Boolean)

    const displayImages = images.length ? images : ['/Icons/arcmatlogo.svg']

    const handleAddToCart = () => {
        if (!isPurchasable) return
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }



    // Dynamic attributes
    const dynamicAttributes = product.dynamicAttributes
        ? typeof product.dynamicAttributes === 'string'
            ? JSON.parse(product.dynamicAttributes)
            : product.dynamicAttributes
        : []

    const weight = product.weight
        ? `${product.weight} ${product.weight_type || product.weight_unit || 'kg'}`
        : null

    // CTA Logic
    const showPrimaryAddToCart = isPurchasable
    const showOutOfStockQuote = !isPurchasable

    return (
        <section className="bg-white py-8 md:py-6">
            <Container>
                <div className="flex flex-col">

                    {/* Breadcrumbs */}
                    <nav className="flex text-sm text-gray-500 mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <Link href="/" className="hover:text-[#e09a74] transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/productlist" className="hover:text-[#e09a74] transition-colors">Products</Link>
                        {categories && categories.length > 0 && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900 font-medium">
                                    {categories[categories.length - 1].name}
                                </span>
                            </>
                        )}
                    </nav>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 py-4 md:py-8 lg:py-10 border-b border-gray-200">

                        {/* LEFT: Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-4/3 bg-white rounded-none overflow-hidden">
                                {images.length > 1 ? (
                                    <Swiper
                                        modules={[Navigation, Pagination, Thumbs]}
                                        navigation
                                        pagination={{ clickable: true }}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                        className="h-full w-full product-detail-swiper"
                                    >
                                        {displayImages.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={img || '/Icons/arcmatlogo.svg'}
                                                        alt={`${name || 'Product'} - Image ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                                        className="object-contain"
                                                        priority={idx === 0}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={displayImages[0] || '/Icons/arcmatlogo.svg'}
                                            alt={name || "Product Image"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                )}
                            </div>

                            {images.length > 1 && (
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    modules={[Thumbs, FreeMode]}
                                    spaceBetween={8}
                                    slidesPerView={5}
                                    breakpoints={{
                                        640: { slidesPerView: 6, spaceBetween: 10 },
                                        768: { slidesPerView: 7, spaceBetween: 12 },
                                    }}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    className="product-thumbs-swiper"
                                >
                                    {images.map((img, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="relative aspect-square bg-white overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-400 transition-all">
                                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* RIGHT: Product Info */}
                        <div className="flex flex-col">
                            <div className="flex-1 flex flex-col">
                                <div className="mb-4">
                                    {product.brand && (
                                        <Link href="#" className="text-2xl font-extrabold text-gray-600 hover:text-[#e09a74] transition-colors mb-2 inline-block">
                                            {typeof product.brand === 'object' ? (product.brand.name || product.brand.brand_name) : product.brand}
                                        </Link>
                                    )}
                                    {/* BADGES SECTION */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {isPremium && (
                                            <span className="px-3 py-1 bg-[#fff2ed] text-[#e09a74] text-[10px] font-bold tracking-wider uppercase rounded-md">
                                                PREMIUM
                                            </span>
                                        )}
                                        {vendorName && (
                                            <span className="px-3 py-1 bg-[#f3f4f6] text-[#6b7280] text-[10px] font-bold tracking-wider uppercase rounded-md">
                                                BY {vendorName}
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 ${inStock ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fbfafa] text-[#00ff04]'} text-[10px] font-bold tracking-wider uppercase rounded-md`}>
                                            {inStock ? 'IN STOCK' : 'LISTED'}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{name}</h1>
                                    <p className="text-base text-gray-700 leading-relaxed mb-4">{subtitle}</p>

                                    {/* PRICE SECTION */}
                                    {(hasPrice || hasMrp) && (
                                        <div className="mt-5 border-t border-dashed border-gray-200 pt-4">
                                            {showOutOfStockQuote ? (
                                                <span className="text-3xl font-bold text-gray-900">
                                                    ₹{Number(mrp).toLocaleString()}
                                                </span>
                                            ) : (
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ₹{Number(price).toLocaleString()}
                                                    </span>
                                                    {Number(mrp) > Number(price) && (
                                                        <>
                                                            <span className="text-lg text-gray-400 line-through">
                                                                ₹{Number(mrp).toLocaleString()}
                                                            </span>
                                                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                                                {Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* PRIMARY CTA */}
                                    {showPrimaryAddToCart && (
                                        <Button
                                            text={isAdded ? "ADDED TO CART" : "ADD TO CART"}
                                            onClick={handleAddToCart}
                                            className={`w-full ${isAdded ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"} font-medium py-2.5 px-5 rounded-full text-sm transition-all flex items-center justify-center gap-2`}
                                        />
                                    )}

                                    {/* OUT OF STOCK OR NO PRICE → GET QUOTATION */}
                                    {showOutOfStockQuote && (
                                        <Button
                                            text="REQUEST QUOTATION"
                                            className="w-full bg-black text-white py-2.5 px-5 rounded-full text-sm"
                                            onClick={() => handleOpenModal({ priceList: true, contactRepresentative: true })}
                                        />
                                    )}

                                    {/* SECONDARY CTA */}
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        <Button
                                            text="REQUEST CATALOGUE"
                                            onClick={() => handleOpenModal({ catalogue: true, contactRepresentative: true })}
                                            className="w-full bg-[#e09a74] hover:bg-[#E09A74] text-black py-2 px-5 rounded-full text-sm"
                                        />
                                        <Button
                                            text="REQUEST BIM / CAD"
                                            onClick={() => handleOpenModal({ bimCad: true })}
                                            className="w-full bg-[#e09a74] hover:bg-[#E09A74] text-black py-2 px-5 rounded-full text-sm"
                                        />
                                        {!showOutOfStockQuote && (
                                            <Button
                                                text="RETAILERS LIST"
                                                onClick={() => handleOpenModal({ retailersList: true })}
                                                className="w-full bg-[#e09a74] hover:bg-[#E09A74] text-black py-2 px-5 rounded-full text-sm"
                                            />
                                        )}
                                    </div>

                                    <button className="mt-2 w-full border border-gray-300 text-gray-900 py-2.5 rounded-full text-sm hover:bg-gray-50 transition">
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 py-4">
                        <div className="flex flex-col gap-8">
                            {/* Overview */}
                            <section className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                                <div className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line wrap-break-word overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: description || `Premium quality ${subtitle?.toLowerCase() || ''} from ${typeof product.brand === 'object' ? (product.brand.name || product.brand.brand_name) : (product.brand || 'Arcmat')}.` }}
                                />
                            </section>

                            {/* Specifications */}
                            {dynamicAttributes.length > 0 && (
                                <section className="bg-white rounded-xl border border-gray-100 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                                    <div className="space-y-3">
                                        {dynamicAttributes.map((attr, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b last:border-b-0 pb-2">
                                                <span className="sm:w-1/3 text-sm font-medium text-gray-700">{attr.attributeName || attr.key}</span>
                                                <span className="sm:w-2/3 text-sm text-gray-600">{attr.attributeValue || attr.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Key Features */}
                            <section className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                                <ul className="space-y-2">
                                    {(product.keyFeatures || [
                                        'Premium high-quality construction',
                                        'Easy installation & minimal maintenance',
                                        'Versatile application support',
                                        'Multiple aesthetic variants',
                                    ]).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Accordion */}
                            <section className="bg-white rounded-xl border border-gray-100 p-2">
                                <Accordion items={[
                                    {
                                        title: 'Shipping & Dimensions', content: <div className="space-y-4 p-3">
                                            <ul className="space-y-2">
                                                {(product.dimensions || ['Standard sizing applies', 'Contact vendor for custom dimensions']).map((dim, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400" />{dim}
                                                    </li>
                                                ))}
                                            </ul>
                                            {weight && (
                                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-blue-50 border border-blue-100">
                                                    <span className="font-semibold text-blue-700">Estimated Weight</span>
                                                    <span className="text-blue-900">{weight}</span>
                                                </div>
                                            )}
                                        </div>
                                    },
                                    {
                                        title: 'Materials & Tags', content: <div className="flex flex-wrap gap-2 p-3">
                                            {(product.tags || product.category_name || 'Arcmat Collection').split(',').map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100 hover:bg-[#e09a74] hover:text-white transition cursor-pointer">
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    }, {
                                        title: 'BIM/CAD Files',
                                        content: (
                                            <div className="flex flex-wrap gap-2 p-3">
                                                <a
                                                    href="/download/demo.dwg"
                                                    download
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-50 text-gray-600 border border-gray-100 hover:bg-[#e09a74] hover:text-white transition cursor-pointer"
                                                >
                                                    2D CAD (.dwg)
                                                </a>
                                                <a
                                                    href="/download/demo.obj"
                                                    download
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-50 text-gray-600 border border-gray-100 hover:bg-[#e09a74] hover:text-white transition cursor-pointer"
                                                >
                                                    3D Model (.obj)
                                                </a>
                                                <a
                                                    href="/download/demo.rfa"
                                                    download
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-50 text-gray-600 border border-gray-100 hover:bg-[#e09a74] hover:text-white transition cursor-pointer"
                                                >
                                                    BIM Object (.rfa)
                                                </a>
                                            </div>
                                        )
                                    }

                                ]} />
                            </section>
                        </div>

                        {/* RIGHT Column */}
                        <aside className="lg:sticky lg:top-24 h-fit">
                            <RequestInfo product={product} />
                        </aside>
                    </div>

                    {/* GLOBAL SWIPER STYLES */}
                    <style jsx global>{`
        .product-detail-swiper .swiper-button-next,
        .product-detail-swiper .swiper-button-prev {
          color: #666;
          background: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .product-detail-swiper .swiper-button-next:after,
        .product-detail-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }
        .product-detail-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
        }
        .product-detail-swiper .swiper-pagination-bullet-active {
          background: #333;
          width: 20px;
          border-radius: 4px;
        }
        .product-thumbs-swiper .swiper-slide-thumb-active .relative {
          border-color: #333 !important;
        }
      `}</style>
                </div>
            </Container>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <RequestInfo
                    product={product}
                    initialRequest={activeRequest}
                    onClose={() => setIsModalOpen(false)}
                    isModal={true}
                />
            </Modal>
        </section>
    )
}

export default ProductDetailView