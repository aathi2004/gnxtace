const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, templateController.getAllTemplates);
router.get('/:id', optionalAuth, templateController.getTemplateById);

module.exports = router;
