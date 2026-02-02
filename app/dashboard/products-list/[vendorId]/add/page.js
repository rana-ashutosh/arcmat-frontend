'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/vendor/ProductForm';
import VariantForm from '@/components/vendor/VariantForm';
import { useCreateProduct } from '@/hooks/useProduct';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';
import Container from '@/components/ui/Container';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function AddProductPage() {
    const router = useRouter();
    const { vendorId } = useParams();
    const { user } = useAuth();
    const createProductMutation = useCreateProduct();

    const [createdProductId, setCreatedProductId] = useState(null);
    const [createdProductData, setCreatedProductData] = useState(null);

    const effectiveVendorId = vendorId || user?._id || user?.id;

    const handleCreateProduct = async (formData) => {
        try {
            const response = await createProductMutation.mutateAsync(formData);
            toast.success('Basic details saved! Now add a variant.');

            const newProduct = response?.data || response;
            const productId = newProduct?._id || newProduct?.id || response?._id || response?.id;

            if (productId) {
                setCreatedProductId(productId);
                setCreatedProductData(newProduct);
            } else {
                toast.error('Product created but failed to retrieve ID. Please try again.');
            }
        } catch (error) {
            const msg = error.response?.data?.message?.message || error.message || 'Failed to create product';
            toast.error(msg);
        }
    };

    const handleVariantComplete = () => {
        router.push(`/dashboard/products-list/${effectiveVendorId}`);
    };

    return (
        <Container className="py-8 max-w-5xl mx-auto">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/products-list/${effectiveVendorId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {createdProductId ? 'Add Variant Details' : 'Add New Product'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {createdProductId
                                ? `Created: ${createdProductData?.product_name || 'Base Product'}`
                                : 'Step 1: Provide basic product information.'}
                        </p>
                    </div>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                    <div className={clsx("flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all",
                        createdProductId ? "bg-green-100 text-green-600" : "bg-[#e09a74] text-white shadow-lg shadow-orange-100")}>
                        {createdProductId ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200"></div>
                    <div className={clsx("flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all",
                        createdProductId ? "bg-[#e09a74] text-white shadow-lg shadow-orange-100" : "bg-gray-100 text-gray-400")}>
                        2
                    </div>
                </div>
            </div>

            {/* Conditional wizard content */}
            {!createdProductId ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <ProductForm
                        onSubmit={handleCreateProduct}
                        isSubmitting={createProductMutation.isPending}
                    />
                </div>
            ) : (
                <VariantForm
                    productId={createdProductId}
                    vendorId={effectiveVendorId}
                    onComplete={handleVariantComplete}
                />
            )}
        </Container>
    );
}
