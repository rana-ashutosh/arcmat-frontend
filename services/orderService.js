import api from '@/lib/api';
export const orderService = {
    getAllOrders: async (params = {}) => {
        const response = await api.get('/order', { params });
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/order/${id}`);
        return response.data;
    },

    getOrdersByUser: async () => {
        const response = await api.get('/order/orderbyuser');
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.post(`/order/changestatus/${id}`, { status });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await api.delete(`/order/${id}`);
        return response.data;
    }
};
