'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Upload } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProductStore } from '@/store/useProductStore';
import { useGetProducts } from '@/hooks/useProduct';
import { useUIStore } from '@/store/useUIStore';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';


// Components
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import VendorProductTable from '@/components/vendor/VendorProductTable';
import BulkActionsBar from '@/components/vendor/BulkActionsBar';
import AttributeCompletionBanner from '@/components/vendor/AttributeCompletionBanner';
import Pagination from '@/components/ui/Pagination';

// Modals
import ProductFormModal from '@/components/vendor/ProductFormModal';
import BulkUploadModal from '@/components/vendor/BulkUploadModal';

// Product List Page
export default function ProductsListPage() {
  const { user, loading: authLoading } = useAuth();
  const { vendorId } = useParams();
  const { getPublicProducts } = useProductStore();
  const { openProductFormModal, openBulkUploadModal } = useUIStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Use vendorId from URL if available, otherwise fallback to user ID
  const effectiveVendorId = vendorId || user?._id || user?.id;

  const { data: apiResponse, isLoading: productsLoading } = useGetProducts({
    userId: effectiveVendorId,
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    status: statusFilter,
    orderby: orderBy,
    order: sortOrder,
    enabled: !!effectiveVendorId && !authLoading
  });

  const apiProducts = apiResponse?.data?.data || apiResponse?.data || apiResponse?.products || [];
  const totalItems =
    apiResponse?.data?.totalCount ??
    apiResponse?.totalCount ??
    apiResponse?.data?.total ??
    apiResponse?.total ??
    apiResponse?.data?.count ??
    apiResponse?.count ??
    apiResponse?.data?.total_products ??
    apiResponse?.total_products ??
    (apiProducts.length === pageSize
      ? (pageSize * currentPage + 1)
      : (pageSize * (currentPage - 1) + apiProducts.length)
    );

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = authLoading || productsLoading;

  if (!mounted || authLoading) return <div className="p-6">Loading...</div>;

  const isVendor = user?.role === 'vendor';
  const productsToDisplay = isVendor ? apiProducts : getPublicProducts();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Container className="py-6 space-y-6">

      {/* Invisible Modals */}
      <ProductFormModal />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isVendor ? 'My Inventory' : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isVendor
              ? 'Manage your prices, stock, and listings.'
              : 'Browse our latest collection.'}
          </p>
        </div>

        {/* VENDOR ADD BUTTON */}
        {isVendor && (
          <div className="flex gap-3">
            <Button
              onClick={() => openBulkUploadModal()}
              className="flex items-center rounded-full bg-white text-[#e09a74] cursor-pointer hover:bg-gray-50 min-w-[120px] py-2 px-4 border border-[#e09a74] duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Link
              href={`/dashboard/products-list/${effectiveVendorId}/add`}
              className="flex items-center rounded-full bg-[#e09a74] text-white cursor-pointer hover:bg-[#d08963] min-w-[120px] py-2 px-4 hover:border-[#e09a74] border hover:text-[#e09a74] hover:bg-white duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>
        )}
      </div>

      {/* CONDITIONAL CONTENT */}
      {isVendor ? (
        // --- VENDOR VIEW ---
        <div className="space-y-4">

          <AttributeCompletionBanner />

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#e09a74] transition-colors"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#e09a74] bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="1">Active Only</option>
                <option value="0">Inactive Only</option>
              </select>

              <select
                value={orderBy}
                onChange={(e) => { setOrderBy(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#e09a74] bg-white text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="product_name">Product Name</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#e09a74] bg-white text-sm"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total: {totalItems} products</span>
            </div>
          </div>

          {/* 2. TABLE VIEW (Now at the top) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Pass REAL API PRODUCTS */}
            <VendorProductTable products={apiProducts} />

            {totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>

        </div>
      ) : (
        <div className="space-y-6">
          <ProductFilters />
          <ProductGrid products={productsToDisplay} />
        </div>
      )}
    </Container>
  );
}