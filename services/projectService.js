import api from '@/lib/api';

export const projectService = {
    getAllProjects: async (params) => {
        const response = await api.get('/project', { params });
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/project/${id}`);
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await api.post('/project', projectData);
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await api.patch(`/project/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await api.delete(`/project/${id}`);
        return response.data;
    }
};
