"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import Header from "@/components/layouts/Header"
import Navbar from "@/components/navbar/navbar"
import ProductDetailView from "@/components/sections/ProductDetailView"
import Container from "@/components/ui/Container"
import Footer from "@/components/layouts/Footer"
import { useGetProduct } from '@/hooks/useProduct'
import { Loader2 } from 'lucide-react'

const ProductDetailPage = () => {
    const params = useParams()
    const id = params.id

    const { data: apiResponse, isLoading, error } = useGetProduct(id)
    const product = apiResponse?.data?.data

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#e09a74] animate-spin" />
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-500 font-medium">Product not found</p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Navbar />
            <ProductDetailView
                product={product}
                categories={apiResponse?.data?.parentcategory}
                childCategories={apiResponse?.data?.childcategory}
            />
            <Footer />
        </div>
    )
}

export default ProductDetailPage
