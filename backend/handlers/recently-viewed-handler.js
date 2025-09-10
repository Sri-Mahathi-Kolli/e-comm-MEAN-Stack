const RecentlyViewed = require('../db/recently-viewed');
const Product = require('../db/product');

// Add product to recently viewed
async function addRecentlyViewed(req, res) {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ 
        error: 'User ID and Product ID are required' 
      });
    }
    
    // Remove if already exists to avoid duplicates (move to top)
    await RecentlyViewed.findOneAndDelete({ userId, productId });
    
    // Add new entry
    const newEntry = new RecentlyViewed({
      userId,
      productId,
      viewedAt: new Date()
    });
    
    await newEntry.save();
    
    // Keep only the last 20 viewed products per user
    const userViews = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 });
    
    if (userViews.length > 20) {
      const toDelete = userViews.slice(20);
      const idsToDelete = toDelete.map(item => item._id);
      await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding recently viewed:', error);
    res.status(500).json({ error: 'Failed to add recently viewed product' });
  }
}

// Get user's recently viewed products
async function getRecentlyViewed(req, res) {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const recentlyViewed = await RecentlyViewed.find({ userId })
      .populate('productId')
      .sort({ viewedAt: -1 })
      .limit(limit);
    
    // Transform the data to match frontend expectations
    const transformedData = recentlyViewed.map(item => ({
      _id: item._id,
      viewedAt: item.viewedAt,
      product: item.productId
    }));
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    res.status(500).json({ error: 'Failed to fetch recently viewed products' });
  }
}

// Clear user's recently viewed history
async function clearRecentlyViewed(req, res) {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    await RecentlyViewed.deleteMany({ userId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
    res.status(500).json({ error: 'Failed to clear recently viewed history' });
  }
}

// Remove specific product from recently viewed
async function removeRecentlyViewed(req, res) {
  try {
    const { userId, productId } = req.params;
    
    if (!userId || !productId) {
      return res.status(400).json({ 
        error: 'User ID and Product ID are required' 
      });
    }
    
    await RecentlyViewed.findOneAndDelete({ userId, productId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing recently viewed:', error);
    res.status(500).json({ error: 'Failed to remove recently viewed product' });
  }
}

module.exports = {
  addRecentlyViewed,
  getRecentlyViewed,
  clearRecentlyViewed,
  removeRecentlyViewed
};
