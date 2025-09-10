const express = require('express');
const router = express.Router();
const { 
    addReview, 
    getProductReviews, 
    getRandomProductReviews, 
    markReviewHelpful, 
    getReviewStats 
} = require('../handlers/review-handler');
const { verifyToken } = require('../db/middleware/auth-middleware');

// Add a new review (requires authentication)
router.post('/add', verifyToken, addReview);

// Get all reviews for a product (with pagination)
router.get('/product/:productId', getProductReviews);

// Get 3 random reviews for a product
router.get('/product/:productId/random', getRandomProductReviews);

// Mark review as helpful
router.put('/:reviewId/helpful', markReviewHelpful);

// Get review statistics for a product
router.get('/product/:productId/stats', getReviewStats);

module.exports = router;
