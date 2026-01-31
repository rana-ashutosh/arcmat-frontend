'use client';

import { useUIStore } from '@/store/useUIStore';
import { CATEGORIES, PRICE_RANGES } from '@/lib/mockData/categories';
import { useVendorStore } from '@/store/useVendorStore';

export default function ProductFilters() {
  const {
    // Search
    searchQuery,
    setSearchQuery,
    // Categories
    selectedCategories,
    setSelectedCategories,
    // Vendors
    selectedVendors,
    setSelectedVendors,
    // Price & Stock
    priceRange,
    setPriceRange,
    stockFilter,
    setStockFilter,
    // Utils
    resetFilters,
  } = useUIStore();

  const { vendors } = useVendorStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-600 hover:text-[#d9a88a] font-medium underline"
        >
          Clear
        </button>
      </div>

      {/* Search - NOW CONNECTED TO STORE */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Search</h4>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Category</h4>
        <select
          value={selectedCategories[0] || ''}
          onChange={(e) => setSelectedCategories(e.target.value ? [parseInt(e.target.value)] : [])}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor - NOW CONNECTED TO STORE */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Vendor</h4>
        <select
          value={selectedVendors[0] || ''}
          onChange={(e) => setSelectedVendors(e.target.value ? [parseInt(e.target.value)] : [])}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]"
        >
          <option value="">All Vendors</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 px-1">
            <span>${priceRange.min}</span>
            <span>${priceRange.max === Infinity ? '1000+' : priceRange.max}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange.max === Infinity ? 1000 : priceRange.max}
            onChange={(e) => setPriceRange({ min: 0, max: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d9a88a]"
          />
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={stockFilter === true}
            onChange={(e) => setStockFilter(e.target.checked ? true : null)}
            className="h-5 w-5 text-[#d9a88a] focus:ring-[#d9a88a] border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}