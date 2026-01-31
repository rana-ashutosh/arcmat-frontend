import { useUIStore } from '@/store/useUIStore';
import ProductForm from './ProductForm';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProduct';
import { toast } from '@/components/ui/Toast';

export default function ProductFormModal() {
  const {
    isProductFormModalOpen,
    closeProductFormModal,
    editingProduct
  } = useUIStore();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        await updateProduct.mutateAsync({ id, data: formData });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully");
      }
      closeProductFormModal();
    } catch (e) {
      const msg = e.response?.data?.message?.message || e.message || "Failed to save product";
      toast.error(msg);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  if (!isProductFormModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={closeProductFormModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={closeProductFormModal}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}