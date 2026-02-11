import api from '@/lib/api';

const cartService = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data.data;
    },

    getCartCount: async () => {
        const response = await api.get('/cart/count');
        return response.data.data;
    },

    addToCart: async (cartData) => {
        const response = await api.post('/cart', cartData);
        return response.data;
    },

    updateQuantity: async (cart_id, product_qty) => {
        const response = await api.post('/cart/update-quantity', { cart_id, product_qty });
        return response.data;
    },

    removeFromCart: async (cart_id) => {
        const response = await api.delete(`/cart/${cart_id}`);
        return response.data;
    },

    // Admin only
    getAdminCartList: async () => {
        const response = await api.get('/cart/admin/list');
        return response.data;
    }
};

export default cartService;
