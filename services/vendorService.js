import api from '@/lib/api';

const vendorService = {
    getAllVendors: async () => {
        const response = await api.get('/brand');

        return response.data;
    },

    getVendorById: async (id) => {
        const response = await api.get(`/brand/${id}`);
        return response.data;
    },

    createVendor: async (vendorData) => {
        const config = {};
        if (vendorData instanceof FormData) {
            config.headers = { 'Content-Type': undefined };
        }

        const response = await api.post('/brand', vendorData, config);
        return response.data;
    },

    updateVendor: async (id, vendorData) => {
        const config = {};
        if (vendorData instanceof FormData) {
            config.headers = { 'Content-Type': undefined };
        }
        const response = await api.patch(`/brand/${id}`, vendorData, config);
        return response.data;
    },

    deleteVendor: async (id) => {
        const response = await api.delete(`/brand/${id}`);
        return response.data;
    }
};

export default vendorService;
