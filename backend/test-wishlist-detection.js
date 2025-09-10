require('dotenv').config();
const chatbotService = require('./services/chatbot.service');

async function testWishlistDetection() {
    console.log('Testing wishlist intent detection...\n');
    
    const testCases = [
        "View my wishlist",
        "Show my wishlist", 
        "Check my wishlist",
        "Add to wishlist",
        "Save for later"
    ];
    
    for (const message of testCases) {
        console.log(`Testing: "${message}"`);
        try {
            const response = await chatbotService.processUserMessage(message, null);
            console.log(`  → Intent: ${response.type}`);
            console.log(`  → Message: ${response.message.substring(0, 60)}...`);
        } catch (error) {
            console.log(`  → Error: ${error.message}`);
        }
        console.log('');
    }
}

testWishlistDetection();
