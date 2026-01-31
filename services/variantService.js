import api from '@/lib/api';

export const variantService = {
    // Get all variants for a product
    getVariantsByProductId: async (productId) => {
        const response = await api.get(`/variant/id/${productId}`);
        return response.data;
    },

    // Get single variant
    getVariantById: async (id) => {
        const response = await api.get(`/variant/${id}`);
        return response.data;
    },

    // Create variant
    createVariant: async (variantData) => {
        // Note: This expects FormData if images are included
        const response = await api.post('/variant', variantData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update variant
    updateVariant: async (id, variantData) => {
        const response = await api.patch(`/variant/${id}`, variantData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete variant
    deleteVariant: async (id) => {
        const response = await api.delete(`/variant/${id}`);
        return response.data;
    },
};
