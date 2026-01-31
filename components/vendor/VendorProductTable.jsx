'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import { useUIStore } from '@/store/useUIStore';
import { useDeleteProduct, useUpdateProduct } from '@/hooks/useProduct';
import { useGetCategories } from '@/hooks/useCategory';
import { useAuth } from '@/hooks/useAuth';
import StatusBadge from '../ui/StatusBadge';
import { toast } from '../ui/Toast';
import clsx from 'clsx';
import Button from '../ui/Button';
import BulkActionsBar from './BulkActionsBar';
import BulkUploadModal from './BulkUploadModal';

export default function VendorProductTable({ products = [] }) {
  const { user } = useAuth();
  const { data: categoryData } = useGetCategories();
  const categoriesList = categoryData?.data || [];
  const {
    selectedProducts,
    toggleSelection,
    clearSelection,
  } = useProductStore();

  const deleteProductMutation = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();

  const { openProductFormModal, openBulkUploadModal } = useUIStore();

  const [selectAll, setSelectAll] = useState(false);

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    const cat = categoriesList.find((c) => (c._id || c.id) === categoryId);
    return cat?.name || categoryId;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      clearSelection();
    } else {
      products.forEach((p) => {
        const id = p._id || p.id;
        if (!selectedProducts.includes(id)) {
          toggleSelection(id);
        }
      });
    }
    setSelectAll(!selectAll);
  };

  const handleDelete = async (productId, productName) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateProductMutation.mutateAsync({ id: productId, data: { status: newStatus } });
      toast.success(
        newStatus === 'Inactive'
          ? 'Product deactivated successfully'
          : 'Product activated successfully'
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#d9a88a] focus:ring-[#d9a88a] border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Attr. Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const id = product._id || product.id;
              const images = product.product_images || product.images || [];
              const name = product.product_name || product.name;
              const description = product.sort_description || product.description;
              const price = product.selling_price ?? product.price;
              const stock = product.stock ?? product.stockQuantity;
              const isActive = product.status === 'Active' || product.isActive === true;
              const status = product.status || (isActive ? 'Active' : 'Inactive');

              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(id)}
                      onChange={() => toggleSelection(id)}
                      className="h-4 w-4 text-[#d9a88a] focus:ring-[#d9a88a] border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0 bg-gray-100 rounded">
                        {images?.[0] ? (
                          <img
                            src={images[0].startsWith('http') ? images[0] : `http://localhost:8000/api/public/uploads/product/${images[0]}`}
                            alt={name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {name}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-1">
                          {description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* Show shorter category or leaf node for space */}

                    {product.categoryPath ? product.categoryPath.split(' > ').pop() : getCategoryName(product.categoryId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      -
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        stock > 0 ? 'text-green-700' : 'text-red-700'
                      )}
                    >
                      {stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={isActive ? 'active' : 'inactive'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openProductFormModal(product)}
                      className="text-[#d9a88a] hover:text-[#c99775] font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleStatus(id, status)
                      }
                      className="text-blue-700 hover:text-blue-900"
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(id, name)}
                      className="text-red-700 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-bold text-gray-900">
            No products
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Get started by adding your first product.
          </p>

          {/* 2. ADDED BULK UPLOAD BUTTON HERE */}
          {/* <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => openProductFormModal()}
              className="bg-[#d9a88a] text-white hover:bg-[#c99775] border-transparent shadow-sm px-4 py-2 flex items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Prod
            </Button>

            <Button
              variant="outline"
              onClick={() => openBulkUploadModal()}
              className="shadow-sm px-4 py-2 bg-white flex items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Bulk Upload
            </Button>
          </div> */}
        </div>
      )}
      <BulkActionsBar products={products} />
      <BulkUploadModal />
    </div>
  );
}