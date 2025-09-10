const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');
const { verifyTokenOptional } = require('../db/middleware/auth-middleware');

// Chat endpoint - main chatbot interaction
router.post('/chat', verifyTokenOptional, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user ? req.user.id : null;
    
    console.log('Chatbot request:', { message, userId, conversationId });
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Process message with chatbot service
    const response = await chatbotService.processUserMessage(message, userId, conversationId);
    
    res.json({
      success: true,
      response: response,
      conversationId: conversationId || `conv_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      response: {
        message: "I'm having trouble processing your request right now. Please try again later.",
        type: 'error'
      }
    });
  }
});

// Quick actions endpoint
router.get('/quick-actions', verifyTokenOptional, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    const quickActions = [
      { text: "Browse Products", action: "navigate", route: "/customer/products" },
      { text: "Check My Orders", action: "navigate", route: "/orders" },
      { text: "View Cart", action: "navigate", route: "/cart" },
      { text: "Payment Methods", action: "message", message: "payment methods" },
      { text: "Help & Support", action: "message", message: "help" }
    ];
    
    res.json({
      success: true,
      quickActions: quickActions
    });
    
  } catch (error) {
    console.error('Quick actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quick actions'
    });
  }
});

// Help endpoint
router.get('/help', async (req, res) => {
  try {
    const helpInfo = {
      message: "🤖 **AI Shopping Assistant Help**\n\n" +
               "I can help you with:\n" +
               "• 🛍️ **Product Search** - Find products by name, category, or description\n" +
               "• 📦 **Order Management** - Check order status, tracking, and history\n" +
               "• 💳 **Payment Help** - Payment methods, billing, and transaction issues\n" +
               "• 🛒 **Cart & Wishlist** - Manage your shopping cart and saved items\n" +
               "• 🚚 **Shipping Info** - Delivery options, tracking, and policies\n" +
               "• 💬 **General Support** - Account help, returns, and customer service\n\n" +
               "**Tips for better results:**\n" +
               "• Be specific about what you're looking for\n" +
               "• Ask follow-up questions if needed\n" +
               "• Use natural language - I understand context!",
      type: 'help',
      suggestions: [
        "Search for electronics",
        "Check my orders", 
        "Payment methods",
        "Shipping information",
        "Return policy"
      ]
    };
    
    res.json({
      success: true,
      help: helpInfo
    });
    
  } catch (error) {
    console.error('Help endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get help information'
    });
  }
});

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      status: 'online',
      version: '1.0.0',
      features: [
        'Product Search',
        'Order Management', 
        'Payment Support',
        'Shopping Assistance',
        'Customer Support'
      ],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Status endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get status'
    });
  }
});

module.exports = router;
