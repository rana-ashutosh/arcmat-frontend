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
        let payload = bannerData;
        let config = {};

        const containsFiles = (data) => {
            if (data instanceof FormData) return true;
            return Object.values(data).some(value =>
                value instanceof File ||
                value instanceof Blob ||
                (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob))
            );
        };

        if (containsFiles(bannerData) && !(bannerData instanceof FormData)) {
            const formData = new FormData();
            Object.keys(bannerData).forEach(key => {
                const value = bannerData[key];
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
        } else if (bannerData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.patch(`/banner/${id}`, payload, config);
        return response.data;
    },

    // Delete a banner
    deleteBanner: async (id) => {
        const response = await api.delete(`/banner/${id}`);
        return response.data;
    }
};

export default bannerService;
