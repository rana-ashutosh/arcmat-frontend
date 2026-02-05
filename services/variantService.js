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
        let payload = variantData;
        let config = {};

        const containsFiles = (data) => {
            if (data instanceof FormData) return true;
            return Object.values(data).some(value =>
                value instanceof File ||
                value instanceof Blob ||
                (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob))
            );
        };

        if (containsFiles(variantData) && !(variantData instanceof FormData)) {
            const formData = new FormData();
            Object.keys(variantData).forEach(key => {
                const value = variantData[key];
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(v => formData.append(key, v));
                    } else if (typeof value === 'object' && value !== null && !(value instanceof File) && !(value instanceof Blob)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            payload = formData;
            config.headers = { 'Content-Type': 'multipart/form-data' };
        } else if (variantData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.post('/variant', payload, config);
        return response.data;
    },

    // Update variant
    updateVariant: async (id, variantData) => {
        let payload = variantData;
        let config = {};

        const containsFiles = (data) => {
            if (data instanceof FormData) return true;
            return Object.values(data).some(value =>
                value instanceof File ||
                value instanceof Blob ||
                (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob))
            );
        };

        if (containsFiles(variantData) && !(variantData instanceof FormData)) {
            const formData = new FormData();
            Object.keys(variantData).forEach(key => {
                const value = variantData[key];
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(v => formData.append(key, v));
                    } else if (typeof value === 'object' && value !== null && !(value instanceof File) && !(value instanceof Blob)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            payload = formData;
            config.headers = { 'Content-Type': 'multipart/form-data' };
        } else if (variantData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.patch(`/variant/${id}`, payload, config);
        return response.data;
    },

    // Delete variant
    deleteVariant: async (id) => {
        const response = await api.delete(`/variant/${id}`);
        return response.data;
    },
};
