const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    comment: {
        type: String,
        required: true,
        maxLength: 500
    },
    verified: {
        type: Boolean,
        default: false // Set to true if user actually purchased the product
    },
    helpful: {
        type: Number,
        default: 0 // Number of users who found this review helpful
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
