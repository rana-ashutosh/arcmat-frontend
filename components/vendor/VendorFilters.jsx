'use client';

import { useUIStore } from '@/store/useUIStore';
import { CATEGORIES } from '@/lib/mockData/categories';
import { Search, X } from 'lucide-react';

export default function VendorFilters() {
    const { vendorFilters, setVendorFilter, resetVendorFilters } = useUIStore();

    const handleChange = (key, value) => {
        setVendorFilter(key, value);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Product Name, SKU, or Slug..."
                    value={vendorFilters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition duration-150 ease-in-out"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Status Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={vendorFilters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active / Published</option>
                        <option value="inactive">Inactive / Draft</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="low_stock">Low Stock</option>
                    </select>
                </div>

                {/* 2. Category Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={vendorFilters.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                    >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Stock Availability */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                    <select
                        value={vendorFilters.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                    >
                        <option value="all">Any Availability</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="low_stock">Low Stock (&lt; 10)</option>
                    </select>
                </div>

                {/* 4. Price Range */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={vendorFilters.priceRange.min}
                            onChange={(e) => handleChange('priceRange', { ...vendorFilters.priceRange, min: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-black focus:border-black"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={vendorFilters.priceRange.max}
                            onChange={(e) => handleChange('priceRange', { ...vendorFilters.priceRange, max: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                </div>

            </div>

            {/* Clear Filters */}
            <div className="flex justify-end">
                <button
                    onClick={resetVendorFilters}
                    className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
                >
                    <X className="w-4 h-4" />
                    Clear Filters
                </button>
            </div>

        </div>
    );
}