import { create } from 'zustand';
import { MOCK_PRODUCTS } from '@/lib/mockData/products';
import { getMissingAttributes, calculateAttributeStatus } from '@/lib/attributeSchema';

export const useProductStore = create((set, get) => ({
  products: MOCK_PRODUCTS,
  loading: false,
  selectedProducts: [],

  // Get all active, non-hidden products (for public)
  getPublicProducts: () => {
    const { products } = get();
    return products.filter((p) => p.isActive && !p.isHidden);
  },

  // Get products by vendor
  getVendorProducts: (vendorId) => {
    const { products } = get();
    return products.filter((p) => p.vendorId === vendorId);
  },

  // Get vendor products with missing attributes
  getProductsWithMissingAttributes: (vendorId) => {
    const { products } = get();
    const vendorProducts = products.filter((p) => p.vendorId === vendorId);

    // Filter by attributeStatus or check dynamically to be safe
    return vendorProducts.filter(product => {
      // Trust the status if it exists, or calculate it
      // For now, let's allow dynamic check to be robust
      const missing = getMissingAttributes(product);
      return missing.length > 0;
    }).map(product => ({
      ...product,
      missingAttributes: getMissingAttributes(product)
    }));
  },

  // Get all products
  getAllProducts: () => {
    return get().products;
  },

  // Get product by slug
  getProductBySlug: (slug) => {
    const { products } = get();
    return products.find((p) => p.slug === slug);
  },

  // Add single product
  addProduct: (productData) => {
    set((state) => {
      // Prepare initial product with defaults
      const rawProduct = {
        ...productData,
        id: Date.now(),
        slug: productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        isActive: true, // Auto-published
        isHidden: false,
        isFlagged: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attributes: productData.attributes || {},
      };

      // Calculate status
      const newProduct = {
        ...rawProduct,
        attributeStatus: calculateAttributeStatus(rawProduct)
      };

      return { products: [...state.products, newProduct] };
    });
  },

  // NEW: Add multiple products (For Bulk Upload)
  addProducts: (newProductsData) => {
    set((state) => {
      const timestamp = Date.now();

      const newProducts = newProductsData.map((data, index) => {
        const rawProduct = {
          ...data,
          // Add index to timestamp to ensure unique IDs for batch uploads
          id: timestamp + index,
          slug: data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          isActive: true,
          isHidden: false,
          isFlagged: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Ensure images array exists even if CSV didn't provide one
          images: data.images || [],
          attributes: data.attributes || {},
        };

        return {
          ...rawProduct,
          attributeStatus: calculateAttributeStatus(rawProduct)
        };
      });

      return { products: [...state.products, ...newProducts] };
    });
  },

  // Update product
  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updates, updatedAt: new Date().toISOString() };

          // Re-calculate status if attributes or categoryPath might have changed
          if (updates.attributes || updates.categoryPath) {
            merged.attributeStatus = calculateAttributeStatus(merged);
          }

          return merged;
        }
        return p;
      }),
    }));
  },

  // Soft delete (deactivate)
  deleteProduct: (id) => {
    get().updateProduct(id, { isActive: false });
  },

  // Toggle product status
  toggleProductStatus: (id) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ),
    }));
  },

  // Toggle product visibility (admin only in future)
  toggleProductVisibility: (id) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, isHidden: !p.isHidden } : p
      ),
    }));
  },

  // Bulk actions
  bulkUpdateStatus: (ids, isActive) => {
    set((state) => ({
      products: state.products.map((p) =>
        ids.includes(p.id) ? { ...p, isActive } : p
      ),
    }));
  },

  bulkUpdateCategory: (ids, categoryId) => {
    set((state) => ({
      products: state.products.map((p) =>
        ids.includes(p.id) ? { ...p, categoryId } : p
      ),
    }));
  },

  bulkDelete: (ids) => {
    set((state) => ({
      products: state.products.map((p) =>
        ids.includes(p.id) ? { ...p, isActive: false } : p
      ),
    }));
  },

  // Selection management
  setSelectedProducts: (ids) => set({ selectedProducts: ids }),
  clearSelection: () => set({ selectedProducts: [] }),
  toggleSelection: (id) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.includes(id)
        ? state.selectedProducts.filter((pid) => pid !== id)
        : [...state.selectedProducts, id],
    })),
}));