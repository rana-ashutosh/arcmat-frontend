import api from '@/lib/api';

export const brandService = {
    getAllBrands: async (params = {}) => {
        const response = await api.get('/brand', { params });
        return response.data;
    },

    getBrandById: async (id) => {
        const response = await api.get(`/brand/${id}`);
        return response.data;
    },

    createBrand: async (brandData) => {
        const config = brandData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await api.post('/brand', brandData, config);
        return response.data;
    },

    updateBrand: async (id, brandData) => {
        const config = brandData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await api.patch(`/brand/${id}`, brandData, config);
        return response.data;
    },

    deleteBrand: async (id) => {
        const response = await api.delete(`/brand/${id}`);
        return response.data;
    },
};
