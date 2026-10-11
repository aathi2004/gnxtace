const { db } = require('../db');

function formatTemplate(template) {
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
    is_favorite: true
  };
}

// GET /api/favorites - Get all favorited templates for logged-in user
async function getFavorites(req, res) {
  try {
    const userId = req.user.id;

    const favoriteRows = await db('favorites')
      .join('templates', 'favorites.template_id', '=', 'templates.id')
      .where('favorites.user_id', userId)
      .select(
        'templates.*',
        'favorites.id as favorite_id',
        'favorites.created_at as favorited_at'
      )
      .orderBy('favorites.id', 'desc');

    const formatted = favoriteRows.map(formatTemplate);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      favorites: formatted
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve favorite templates.'
    });
  }
}

// POST /api/favorites/:templateId - Add to favorites (authenticated)
async function addFavorite(req, res) {
  try {
    const userId = req.user.id;
    const templateId = parseInt(req.params.templateId, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID parameter.'
      });
    }

    // Verify template exists
    const template = await db('templates').where({ id: templateId }).first();
    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Template #${templateId} does not exist.`
      });
    }

    // Check if already favorited
    const existing = await db('favorites')
      .where({ user_id: userId, template_id: templateId })
      .first();

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Template is already in your favorites.',
        is_favorite: true,
        template: formatTemplate(template)
      });
    }

    // Insert new favorite
    const [favId] = await db('favorites').insert({
      user_id: userId,
      template_id: templateId
    });

    return res.status(201).json({
      success: true,
      message: 'Template successfully added to favorites!',
      favorite_id: favId,
      is_favorite: true,
      template: formatTemplate(template)
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add template to favorites.'
    });
  }
}

// DELETE /api/favorites/:templateId - Remove from favorites (authenticated)
async function removeFavorite(req, res) {
  try {
    const userId = req.user.id;
    const templateId = parseInt(req.params.templateId, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID parameter.'
      });
    }

    const deleted = await db('favorites')
      .where({ user_id: userId, template_id: templateId })
      .del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'This template is not in your favorites.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Template removed from favorites.',
      is_favorite: false,
      templateId
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove template from favorites.'
    });
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
