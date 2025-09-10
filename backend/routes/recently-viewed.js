const express = require('express');
const router = express.Router();
const { 
  addRecentlyViewed, 
  getRecentlyViewed, 
  clearRecentlyViewed, 
  removeRecentlyViewed 
} = require('../handlers/recently-viewed-handler');

// POST /api/recently-viewed - Add product to recently viewed
router.post('/', addRecentlyViewed);

// GET /api/recently-viewed/:userId - Get user's recently viewed products
router.get('/:userId', getRecentlyViewed);

// DELETE /api/recently-viewed/:userId - Clear user's recently viewed history
router.delete('/:userId', clearRecentlyViewed);

// DELETE /api/recently-viewed/:userId/:productId - Remove specific product
router.delete('/:userId/:productId', removeRecentlyViewed);

module.exports = router;
