import api from '@/lib/api';

export const retailerService = {
    // Brand Management
    getRetailerBrands: async () => {
        const response = await api.get('/retailer/brands');
        return response.data;
    },

    updateRetailerBrands: async ({ brandId, action }) => {
        const response = await api.patch('/retailer/brands', { brandId, action });
        return response.data;
    },

    getBrandInventory: async (brandId, params = {}) => {
        const response = await api.get(`/retailer/brands/${brandId}/inventory`, { params });
        return response.data;
    },

    // Product & Override Management
    getRetailerProducts: async (params = {}) => {
        const response = await api.get('/retailer/products', { params });
        return response.data;
    },

    upsertProductOverride: async (data) => {
        // data: { productId, variantId, mrp_price, selling_price, stock, isActive }
        // If updating existing, include 'id' in data or pass separately if needed.
        // The backend post/patch both use upsertRetailerProduct, so we use POST for both.
        const response = await api.post('/retailer/products', data);
        return response.data;
    },

    updateProductOverride: async (id, data) => {
        const response = await api.patch(`/retailer/products/${id}`, data);
        return response.data;
    }
};
