import api from '@/lib/api';

const bannerService = {
    // Get all banners (with optional filters)
    getAllBanners: async (params = {}) => {
        const response = await api.get('/banner', { params });
        return response.data;
    },

    // Get single banner by ID
    getBannerById: async (id) => {
        const response = await api.get(`/banner/${id}`);
        return response.data;
    },

    // Create a new banner
    createBanner: async (bannerData) => {
        const config = {};
        // If sending FormData (which we are for images), let the browser set Content-Type
        if (bannerData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.post('/banner', bannerData, config);
        return response.data;
    },

    // Update an existing banner
    updateBanner: async (id, bannerData) => {
        const config = {};
        if (bannerData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.patch(`/banner/${id}`, bannerData, config);
        return response.data;
    },

    // Delete a banner
    deleteBanner: async (id) => {
        const response = await api.delete(`/banner/${id}`);
        return response.data;
    }
};

export default bannerService;
