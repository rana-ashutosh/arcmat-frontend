'use client';

import { useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useUIStore } from '@/store/useUIStore';
import { CATEGORIES } from '@/lib/mockData/categories';
import { toast } from '../ui/Toast';

export default function BulkActionsBar({ products = [] }) {
  const {
    selectedProducts,
    bulkUpdateStatus,
    bulkUpdateCategory,
    bulkDelete,
    clearSelection,
  } = useProductStore();

  const { openProductFormModal } = useUIStore();
  const [selectedAction, setSelectedAction] = useState('');

  // If no products selected, don't render anything
  if (selectedProducts.length === 0) return null;

  const handleBulkAction = () => {
    if (!selectedAction) return;

    switch (selectedAction) {
      case 'edit':
        if (selectedProducts.length === 1) {
          const productToEdit = products.find((p) => (p._id || p.id) === selectedProducts[0]);
          if (productToEdit) {
            openProductFormModal(productToEdit);
          }
        } else {
          toast.error('Please select only one product to edit');
        }
        break;

      case 'activate':
        bulkUpdateStatus(selectedProducts, true);
        toast.success(`${selectedProducts.length} products activated`);
        break;

      case 'deactivate':
        bulkUpdateStatus(selectedProducts, false);
        toast.success(`${selectedProducts.length} products deactivated`);
        break;

      case 'delete':
        if (confirm(`Delete ${selectedProducts.length} products?`)) {
          bulkDelete(selectedProducts);
          toast.success(`${selectedProducts.length} products deleted`);
        }
        break;

      default:
        if (selectedAction.startsWith('category-')) {
          const categoryId = parseInt(selectedAction.replace('category-', ''));
          bulkUpdateCategory(selectedProducts, categoryId);
          const categoryName = CATEGORIES.find((c) => c.id === categoryId)?.name;
          toast.success(
            `${selectedProducts.length} products moved to ${categoryName}`
          );
        }
    }

    // If action was edit, we keep selection so user sees what they are editing. 
    // Otherwise, clear selection after action.
    if (selectedAction !== 'edit') {
      clearSelection();
      setSelectedAction('');
    } else {
      setSelectedAction('');
    }
  };

  return (
    // CHANGED: 'sticky top-0' makes it stick to the top of the scrollable area
    // 'z-30' ensures it floats above table headers
    // 'border-b' puts the border on the bottom
    <div className="sticky top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm mb-4 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
              {selectedProducts.length} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-black"
            >
              <option value="">Select Action...</option>

              {/* Only show Edit if exactly 1 item is selected */}
              {selectedProducts.length === 1 && (
                <option value="edit">Edit Product</option>
              )}

              <option value="activate">Set Active</option>
              <option value="deactivate">Set Inactive</option>
              <option value="delete">Delete</option>

              <optgroup label="Move to Category">
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={`category-${cat.id}`}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              onClick={handleBulkAction}
              disabled={!selectedAction}
              className="px-4 py-2 bg-[#DCB095] text-white rounded-lg hover:bg-[#c99775] disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}