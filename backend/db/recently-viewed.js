const mongoose = require("mongoose");
const { Schema } = mongoose;

const recentlyViewedSchema = new mongoose.Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'users',
        required: true 
    },
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'products',
        required: true 
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for efficient queries
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });
recentlyViewedSchema.index({ userId: 1, productId: 1 }, { unique: true });

const RecentlyViewed = mongoose.model('recently-viewed', recentlyViewedSchema);

module.exports = RecentlyViewed;
