import api from '@/lib/api';

export const wishlistService = {
    // Get user wishlist
    getWishlist: async () => {
        const response = await api.get('/wishlist');
        return response.data;
    },

    // Add to wishlist
    addToWishlist: async (data) => {
        const response = await api.post('/wishlist', data);
        return response.data;
    },

    // Remove from wishlist
    removeFromWishlist: async (id) => {
        const response = await api.delete(`/wishlist/${id}`);
        return response.data;
    }
};
