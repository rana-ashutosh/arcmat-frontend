import api from '@/lib/api';

const categoryService = {
    // Get all categories (flat list)
    getAllCategories: async (params = {}) => {
        const response = await api.get('/category', { params });
        return response.data;
    },

    // Get categories tree structure
    getCategoryTree: async () => {
        const response = await api.get('/category/tree');
        return response.data;
    },

    // Get single category by ID
    getCategoryById: async (id) => {
        const response = await api.get(`/category/${id}`);
        return response.data;
    },

    // Create a new category
    createCategory: async (categoryData) => {
        const config = {};
        // If sending FormData (which we are for images), let the browser set Content-Type
        if (categoryData instanceof FormData) {
            config.headers = { 'Content-Type': undefined };
        }

        const response = await api.post('/category', categoryData, config);
        return response.data;
    },

    // Update an existing category
    updateCategory: async (id, categoryData) => {
        const config = {};
        if (categoryData instanceof FormData) {
            config.headers = { 'Content-Type': undefined };
        }
        const response = await api.patch(`/category/${id}`, categoryData, config);
        return response.data;
    },

    // Delete a category
    deleteCategory: async (id) => {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    },

    // Get frontend category list (optimized for UI)
    getFrontendCategoryList: async () => {
        const response = await api.get('/category/frontedcategorylist');
        return response.data;
    },

    // Get subcategories for given parent IDs
    getSubcategories: async (parentIdsString) => {
        // API expects { categorys: "id1,id2" }
        const response = await api.post('/category/subcategory', { categorys: parentIdsString });
        return response.data;
    }
};

export default categoryService;
