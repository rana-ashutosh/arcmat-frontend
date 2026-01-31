'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import CategoryStats from '@/components/vendor/CategoryStats';
import CategoryTable from '@/components/vendor/CategoryTable';
import AddCategoryModal from '@/components/vendor/AddCategoryModal';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { toast } from '@/components/ui/Toast';
import { useGetCategories, useCreateCategory } from '@/hooks/useCategory';

import { useAuth } from '@/hooks/useAuth';

export default function CategoriesPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: apiResponse, isLoading, error } = useGetCategories(user?._id);
    const categories = apiResponse?.data || [];

    const createCategoryMutation = useCreateCategory();

    const categoryData = useMemo(() => {
        if (!categories.length) return [];

        const categoryMap = new Map();
        categories.forEach(cat => categoryMap.set(cat._id, cat));

        const getPath = (cat) => {
            const pathParts = [cat.name];
            let current = cat;
            while (current.parentId && categoryMap.has(current.parentId)) {
                current = categoryMap.get(current.parentId);
                pathParts.unshift(current.name);
            }
            return pathParts.join(' > ');
        };

        return categories.map(cat => ({
            categoryId: cat._id,
            name: cat.name,
            path: getPath(cat),
            level: cat.level,
            parentId: cat.parentId,
            totalProducts: 0,
            incompleteProducts: 0,
            status: cat.status
        }));
    }, [categories]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categoryData;
        return categoryData.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.path.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categoryData, searchQuery]);

    const overallStats = useMemo(() => {
        return categoryData.reduce(
            (acc, cat) => {
                acc.totalCategories += 1;
                return acc;
            },
            { totalCategories: 0 }
        );
    }, [categoryData]);

    const handleAddCategory = async (formData) => {
        try {
            if (user?._id) {
                formData.append('userid', user._id);
            }
            const result = await createCategoryMutation.mutateAsync(formData);
            return result.data._id;
        } catch (error) {
            const errorMessage = error.response?.data?.message?.name?.message || "Failed to create category";
            toast.error(errorMessage);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <Container className="py-8 flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-8 text-center text-red-500">
                Failed to load categories. Please try again later.
            </Container>
        );
    }

    return (
        <Container className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your product categories.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <div className="relative flex-1 w-full sm:w-auto">
                        <Search className="absolute left-3  top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border bg-white border-[#C99775] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C99775] w-full text-black"
                        />
                    </div>

                    <Button
                        text="Add Category"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center bg-[#e09a74] text-white cursor-pointer hover:bg-[#d08963] min-w-[120px] py-2 px-4 hover:border-[#e09a74] border hover:text-[#e09a74] hover:bg-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                    </Button>
                </div>

            </div>

            {/* <CategoryStats stats={overallStats} /> */}

            <CategoryTable categories={filteredCategories} />

            <AddCategoryModal
                isOpen={isAddModalOpen}
                existingCategories={categoryData}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddCategory}
            />
        </Container>
    );
}