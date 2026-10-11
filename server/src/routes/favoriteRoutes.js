const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All favorite routes require authentication
router.use(authenticateToken);

// GET /api/favorites - Get all favorited templates for logged-in user
router.get('/', favoriteController.getFavorites);

// POST /api/favorites/:templateId - Add to favorites
router.post('/:templateId', favoriteController.addFavorite);

// DELETE /api/favorites/:templateId - Remove from favorites
router.delete('/:templateId', favoriteController.removeFavorite);

module.exports = router;
