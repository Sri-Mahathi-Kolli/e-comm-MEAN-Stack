require('dotenv').config();
const chatbotService = require('./services/chatbot.service');

async function comprehensiveTest() {
    console.log('🎉 COMPREHENSIVE AI CHATBOT TEST\n');
    console.log('Testing all enhanced AI features...\n');
    
    const testCases = [
        // Payment related
        { input: "Tell me about payment methods", expected: "payment_info" },
        { input: "View payment history", expected: "payment_info" },
        { input: "payment methods", expected: "payment_info" },
        
        // Shopping cart
        { input: "Put this in my basket", expected: "add_to_cart" },
        { input: "Buy this item", expected: "add_to_cart" },
        
        // Wishlist
        { input: "Save this for later", expected: "add_to_wishlist" },
        { input: "Keep this item", expected: "add_to_wishlist" },
        { input: "Add to my favorites", expected: "add_to_wishlist" },
        
        // Orders
        { input: "Check my orders", expected: "order_status" },
        { input: "I bought something last week but haven't received it", expected: "order_status" },
        
        // Product search
        { input: "What items are available?", expected: "product_search" },
        { input: "Show me what you have for sale", expected: "product_search" },
        
        // Shipping
        { input: "Where is my package?", expected: "shipping_info" },
        { input: "What are your shipping options?", expected: "shipping_info" },
        
        // Returns
        { input: "How do I return an item?", expected: "return_policy" },
        
        // Help
        { input: "I need assistance", expected: "help" },
        
        // Greetings
        { input: "Hello", expected: "greeting" },
        { input: "Hi there", expected: "greeting" }
    ];
    
    let passedTests = 0;
    let totalTests = testCases.length;
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`${i + 1}. Testing: "${testCase.input}"`);
        
        try {
            const response = await chatbotService.processUserMessage(testCase.input, null);
            const actualIntent = response.type === 'auth_required' ? 'payment_info' : response.type;
            
            if (actualIntent === testCase.expected || 
                (testCase.expected === 'payment_info' && actualIntent === 'payment_methods')) {
                console.log(`   ✅ PASS - Detected: ${actualIntent}`);
                passedTests++;
            } else {
                console.log(`   ❌ FAIL - Expected: ${testCase.expected}, Got: ${actualIntent}`);
            }
        } catch (error) {
            console.log(`   ❌ ERROR - ${error.message}`);
        }
        console.log('');
    }
    
    console.log(`🎯 TEST RESULTS: ${passedTests}/${totalTests} tests passed (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! AI Enhancement is working perfectly!');
    } else {
        console.log('⚠️ Some tests failed. AI may need further fine-tuning.');
    }
}

comprehensiveTest();
