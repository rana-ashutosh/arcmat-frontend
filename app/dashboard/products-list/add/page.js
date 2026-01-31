'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/vendor/ProductForm';
import { useCreateProduct } from '@/hooks/useProduct';
import { toast } from '@/components/ui/Toast';
import Container from '@/components/ui/Container';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
    const router = useRouter();
    const createProductMutation = useCreateProduct();

    const handleCreateProduct = async (formData) => {
        try {
            await createProductMutation.mutateAsync(formData);
            toast.success('Product created successfully!');
            router.push('/dashboard/products-list');
        } catch (error) {
            const msg = error.response?.data?.message?.message || error.message || 'Failed to create product';
            toast.error(msg);
        }
    };

    return (
        <Container className="py-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/products-list" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-500">Create a new product listing in your inventory.</p>
                </div>
            </div>

            {/* Form */}
            <ProductForm
                onSubmit={handleCreateProduct}
                isSubmitting={createProductMutation.isPending}
            />
        </Container>
    );
}
