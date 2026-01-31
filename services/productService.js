import api from '@/lib/api';

export const productService = {
    // Get all products (with optional filters)
    getAllProducts: async (params) => {
        const response = await api.get('/product', { params });
        return response.data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    },

    // Create a new product
    // Payload should be FormData due to file uploads
    createProduct: async (productData) => {
        const response = await api.post('/product', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update a product
    updateProduct: async (id, productData) => {
        const response = await api.patch(`/product/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a product
    deleteProduct: async (id) => {
        const response = await api.delete(`/product/${id}`);
        return response.data;
    },

    // Bulk Import Products
    bulkImport: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/product/bulk-import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
