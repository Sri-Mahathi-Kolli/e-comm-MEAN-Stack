const Review = require('../db/review');
const Product = require('../db/product');
const User = require('../db/user');
const mongoose = require('mongoose');

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.user.id;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create user display name from firstName and lastName
        const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Anonymous User';

        // Create new review
        const review = new Review({
            productId,
            userId,
            userName: userName,
            rating,
            title,
            comment,
            verified: true // You can implement logic to check if user actually bought the product
        });

        await review.save();

        // Update product's average rating
        await updateProductRating(productId);

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

// Get reviews for a product (with pagination, default limit of 3 for consistency)
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 3 } = req.query;

        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('userId', 'name');

        const total = await Review.countDocuments({ productId });

        res.json({
            reviews,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get 3 random reviews for a product (or fewer if less than 3 exist)
const getRandomProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        // First, count total reviews for this product
        const totalReviews = await Review.countDocuments({ productId: new mongoose.Types.ObjectId(productId) });
        
        // Determine sample size (max 3, but could be less if fewer reviews exist)
        const sampleSize = Math.min(3, totalReviews);
        
        if (sampleSize === 0) {
            return res.json([]);
        }

        const reviews = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { $sample: { size: sampleSize } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    rating: 1,
                    title: 1,
                    comment: 1,
                    userName: 1,
                    verified: 1,
                    helpful: 1,
                    createdAt: 1
                }
            }
        ]);

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching random reviews', error: error.message });
    }
};

// Update review helpfulness
const markReviewHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $inc: { helpful: 1 } },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({ message: 'Review marked as helpful', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

// Get review statistics for a product
const getReviewStats = async (req, res) => {
    try {
        const { productId } = req.params;

        const stats = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const totalReviews = await Review.countDocuments({ productId });
        const avgRating = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        res.json({
            totalReviews,
            averageRating: avgRating[0]?.avgRating || 0,
            ratingDistribution: stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review statistics', error: error.message });
    }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
    try {
        const result = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(result[0].avgRating * 10) / 10,
                totalReviews: result[0].totalReviews
            });
        }
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
};

module.exports = {
    addReview,
    getProductReviews,
    getRandomProductReviews,
    markReviewHelpful,
    getReviewStats
};
