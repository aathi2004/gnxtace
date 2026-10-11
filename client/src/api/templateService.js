import api from './axios';

export const templateService = {
  // Get all templates with optional query filters (search, category, sort)
  getTemplates: async (params = {}) => {
    const response = await api.get('/templates', { params });
    return response.data;
  },

  // Get template details by ID
  getTemplateById: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  // Get all favorite templates for authenticated user
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Add template to favorites
  addFavorite: async (templateId) => {
    const response = await api.post(`/favorites/${templateId}`);
    return response.data;
  },

  // Remove template from favorites
  removeFavorite: async (templateId) => {
    const response = await api.delete(`/favorites/${templateId}`);
    return response.data;
  },
};
