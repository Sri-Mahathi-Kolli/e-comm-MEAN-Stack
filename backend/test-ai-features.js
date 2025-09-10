require('dotenv').config();
const chatbotService = require('./services/chatbot.service');

async function testAIFeatures() {
    const testMessages = [
        "hello",
        "I want to buy something",
        "Save this for later",
        "Put this in my basket", 
        "Where is my package?",
        "I bought something last week but haven't received it",
        "Add to my favorites",
        "What products do you have?",
        "Help me find products"
    ];
    
    console.log('🧠 Testing AI Enhanced Chatbot Features\n');
    
    for (let i = 0; i < testMessages.length; i++) {
        const message = testMessages[i];
        console.log(`${i + 1}. Testing: "${message}"`);
        
        try {
            const response = await chatbotService.processUserMessage(message, null);
            console.log(`   ✅ Response Type: ${response.type}`);
            console.log(`   💬 Message: ${response.message.substring(0, 100)}...`);
            if (response.suggestions) {
                console.log(`   💡 Suggestions: ${response.suggestions.slice(0, 2).join(', ')}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        console.log('');
    }
    
    console.log('🎉 AI Chatbot testing complete!');
}

testAIFeatures();
