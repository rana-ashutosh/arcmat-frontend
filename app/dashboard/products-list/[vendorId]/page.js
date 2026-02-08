'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Upload, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProductStore } from '@/store/useProductStore';
import { useGetProducts } from '@/hooks/useProduct';
import { useUIStore } from '@/store/useUIStore';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { productService } from '@/services/productService';


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
import RoleGuard from '@/components/auth/RoleGaurd';

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
  const [isExporting, setIsExporting] = useState(false);

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

  const isLoading = authLoading || productsLoading;

  const handleExport = async (format = 'xlsx') => {
    if (!effectiveVendorId) return;
    setIsExporting(true);
    try {
      // Fetch ALL products matching current filters for export
      const response = await productService.getAllProducts({
        userid: effectiveVendorId,
        user_id: effectiveVendorId,
        page: 1,
        limit: 10000, // Fetch up to 10k items for export
        search: searchTerm,
        status: statusFilter,
        orderby: orderBy,
        order: sortOrder,
      });

      const productsToExport = response?.data?.data || response?.data || response?.products || [];

      if (productsToExport.length === 0) {
        toast.error("No products to export");
        return;
      }

      // Format data for Export
      const exportData = productsToExport.map(p => {
        // Flatten Variant Data
        const minPrice = p.minPrice || (p.variants?.length ? Math.min(...p.variants.map(v => v.selling_price || 0)) : 0);
        const maxPrice = p.maxPrice || (p.variants?.length ? Math.max(...p.variants.map(v => v.selling_price || 0)) : 0);
        const totalStock = p.totalStock || (p.variants?.length ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0);

        return {
          'Product Name': p.product_name,
          'SKU Code': p.skucode || '',
          'Product URL': p.product_url,

          // Category Hierarchy
          'Category (L1)': p.categoryId?.name || '',
          'Sub Category (L2)': p.subcategoryId?.name || '',
          'Sub-Sub Category (L3)': p.subsubcategoryId?.name || '',

          // Pricing & Stock
          'Price Range': minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`,
          'Total Stock': totalStock,

          // Details
          'Brand': p.brand?.name || p.brand || '', // Handle populated object or ID string
          'Short Description': p.sort_description || '',
          'Description': p.description || '',

          // SEO
          'Meta Title': p.meta_title || '',
          'Meta Keywords': p.meta_keywords || '',
          'Meta Description': p.meta_description || '',

          // Status & Metadata
          'Status': p.status === 1 ? 'Active' : 'Inactive',
          'Created At': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
          'Updated At': p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '',

          // Images
          'Images': (p.product_images || []).join(', ')
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      const ext = format === 'csv' ? 'csv' : 'xlsx';
      XLSX.writeFile(wb, `Products_Export_${new Date().toISOString().split('T')[0]}.${ext}`);

      toast.success(`Successfully exported ${productsToExport.length} products as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };


  if (authLoading) return <div className="p-6">Loading...</div>;

  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  const showManagementUI = isAdmin || isVendor;

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
    <RoleGuard allowedRoles={['admin', 'vendor']}>
      <Container className="py-6 space-y-6">

        {/* Invisible Modals */}
        <ProductFormModal />
        <BulkUploadModal />

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
              <div className="flex bg-white rounded-full border border-green-600 overflow-hidden h-[42px] items-center">
                <button
                  onClick={() => handleExport('xlsx')}
                  disabled={isExporting}
                  className="px-4 py-2 hover:bg-green-50 text-green-700 text-sm font-medium transition-colors disabled:opacity-50 flex items-center h-full"
                  title="Export as Excel"
                >
                  {isExporting ? <span className="animate-spin mr-1">⏳</span> : <Download className="w-4 h-4 mr-1" />}
                  Excel
                </button>
                <div className="w-px h-6 bg-green-200"></div>
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="px-4 py-2 hover:bg-green-50 text-green-700 text-sm font-medium transition-colors disabled:opacity-50 h-full"
                  title="Export as CSV"
                >
                  CSV
                </button>
              </div>
              <Button
                onClick={() => openBulkUploadModal()}
                className="flex items-center rounded-full bg-white text-[#e09a74] cursor-pointer hover:bg-gray-50 min-w-[120px] py-2 px-4 border border-[#e09a74] duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
              <Link
                href={`/dashboard/products-list/${effectiveVendorId}/add`}
                className="flex items-center rounded-full bg-[#e09a74] text-white cursor-pointer min-w-[120px] py-2 px-4 border border-[#e09a74] hover:bg-white hover:text-[#e09a74] duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* CONDITIONAL CONTENT */}
        {showManagementUI ? (
          <div className="space-y-4">
            {isVendor && <AttributeCompletionBanner />}
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

            {isVendor && <BulkActionsBar products={apiProducts} />}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            <ProductGrid products={getPublicProducts()} />
          </div>
        )}
      </Container>
    </RoleGuard>
  );
}
