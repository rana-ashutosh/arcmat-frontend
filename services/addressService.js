import api from '@/lib/api';

const addressService = {
    getAddresses: async () => {
        const response = await api.get('/address');
        return response.data;
    },

    getAddressById: async (id) => {
        const response = await api.get(`/address/${id}`);
        return response.data;
    },

    createAddress: async (addressData) => {
        const response = await api.post('/address', addressData);
        return response.data;
    },

    updateAddress: async (id, addressData) => {
        const response = await api.patch(`/address/${id}`, addressData);
        return response.data;
    },

    deleteAddress: async (id) => {
        const response = await api.delete(`/address/${id}`);
        return response.data;
    }
};

export default addressService;
