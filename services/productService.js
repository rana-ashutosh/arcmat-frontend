import api from '@/lib/api';

export const productService = {
    // Get all products (with optional filters)
    getAllProducts: async (params) => {
        const response = await api.get('/product', { params });
        return response.data;
    },

    // Get all variants (variant-centric listing)
    getAllVariants: async (params) => {
        const response = await api.get('/variant', { params });
        return response.data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    },

    // Create a new product
    // Payload should be FormData if there are file uploads, otherwise standard JSON
    createProduct: async (productData) => {
        let payload = productData;
        let config = {};

        const containsFiles = (data) => {
            if (data instanceof FormData) return true;
            return Object.values(data).some(value =>
                value instanceof File ||
                value instanceof Blob ||
                (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob))
            );
        };

        if (containsFiles(productData) && !(productData instanceof FormData)) {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                const value = productData[key];
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(v => {
                            if (v instanceof File || v instanceof Blob) {
                                formData.append(key, v);
                            } else {
                                formData.append(key, v);
                            }
                        });
                    } else if (typeof value === 'object' && value !== null && !(value instanceof File) && !(value instanceof Blob)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            payload = formData;
            config.headers = { 'Content-Type': 'multipart/form-data' };
        } else if (productData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.post('/product', payload, config);
        return response.data;
    },

    // Update a product
    updateProduct: async (id, productData) => {
        let payload = productData;
        let config = {};

        const containsFiles = (data) => {
            if (data instanceof FormData) return true;
            return Object.values(data).some(value =>
                value instanceof File ||
                value instanceof Blob ||
                (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob))
            );
        };

        if (containsFiles(productData) && !(productData instanceof FormData)) {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                const value = productData[key];
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
        } else if (productData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.patch(`/product/${id}`, payload, config);
        return response.data;
    },

    // Delete a product
    deleteProduct: async (id) => {
        const response = await api.delete(`/product/${id}`);
        return response.data;
    },

    // Bulk Import Products/Variants
    bulkImport: async (file, type = 'product', productId = null) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        if (productId) {
            formData.append('productId', productId);
        }
        const response = await api.post('/product/bulk-import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
