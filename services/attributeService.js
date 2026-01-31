import api from '@/lib/api';

export const attributeService = {
    // Get all attributes
    getAllAttributes: async () => {
        const response = await api.get('/attribute');
        return response.data;
    },
    // Create new attribute
    createAttribute: async (attributeData) => {
        const response = await api.post('/attribute', attributeData);
        return response.data;
    },
};
