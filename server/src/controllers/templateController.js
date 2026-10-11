const { db } = require('../db');

function formatTemplate(template, userFavoriteIds = new Set()) {
  let parsedTags = [];
  let parsedFeatures = [];

  try {
    parsedTags = typeof template.tags === 'string' ? JSON.parse(template.tags) : (template.tags || []);
  } catch (e) {
    parsedTags = [];
  }

  try {
    parsedFeatures = typeof template.features === 'string' ? JSON.parse(template.features) : (template.features || []);
  } catch (e) {
    parsedFeatures = [];
  }

  return {
    ...template,
    tags: parsedTags,
    features: parsedFeatures,
    is_favorite: userFavoriteIds.has(template.id)
  };
}

// GET /api/templates - List all templates with optional search and category filters
async function getAllTemplates(req, res) {
  try {
    const { search, category, sort } = req.query;

    let query = db('templates');

    if (category && category !== 'All') {
      query = query.where('category', category);
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim().toLowerCase()}%`;
      query = query.where((builder) => {
        builder
          .whereRaw('LOWER(name) LIKE ?', [term])
          .orWhereRaw('LOWER(description) LIKE ?', [term])
          .orWhereRaw('LOWER(category) LIKE ?', [term]);
      });
    }

    if (sort === 'oldest') {
      query = query.orderBy('id', 'asc');
    } else {
      query = query.orderBy('id', 'desc');
    }

    const templates = await query;

    // Check user's favorites if authenticated
    let userFavoriteIds = new Set();
    if (req.user) {
      const favorites = await db('favorites')
        .where({ user_id: req.user.id })
        .select('template_id');
      userFavoriteIds = new Set(favorites.map((f) => f.template_id));
    }

    const formatted = templates.map((t) => formatTemplate(t, userFavoriteIds));

    // Also get distinct categories for filtering convenience
    const categories = await db('templates').distinct('category').pluck('category');

    return res.status(200).json({
      success: true,
      count: formatted.length,
      categories: ['All', ...categories],
      templates: formatted
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates.'
    });
  }
}

// GET /api/templates/:id - Get template details by ID
async function getTemplateById(req, res) {
  try {
    const { id } = req.params;

    const template = await db('templates').where({ id }).first();
    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Template with ID ${id} was not found.`
      });
    }

    let isFavorite = false;
    if (req.user) {
      const fav = await db('favorites')
        .where({ user_id: req.user.id, template_id: template.id })
        .first();
      isFavorite = !!fav;
    }

    const userFavoriteIds = isFavorite ? new Set([template.id]) : new Set();
    const formatted = formatTemplate(template, userFavoriteIds);

    return res.status(200).json({
      success: true,
      template: formatted
    });
  } catch (error) {
    console.error('Error fetching template details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve template details.'
    });
  }
}

module.exports = {
  getAllTemplates,
  getTemplateById
};
