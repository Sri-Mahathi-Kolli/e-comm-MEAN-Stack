const chatbotService = require('./services/chatbot.service');

async function testPaymentIssues() {
    console.log('🧪 Testing Payment Issues Functionality\n');
    
    // Test various payment issue messages
    const testMessages = [
        'payment problem',
        'payment issue',
        'payment not working',
        'card declined',
        'billing issue',
        'payment failed',
        'transaction error',
        'can\'t pay'
    ];
    
    for (const message of testMessages) {
        console.log(`📝 Testing message: "${message}"`);
        try {
            const response = await chatbotService.processMessage(message, '68ad87b90ad1c1fae56ffff4');
            console.log(`✅ Response type: ${response.type}`);
            console.log(`📞 Message: ${response.message.substring(0, 100)}...`);
            console.log(`💡 Suggestions: ${response.suggestions.join(', ')}`);
            console.log('---');
        } catch (error) {
            console.error(`❌ Error testing "${message}":`, error.message);
        }
    }
}

testPaymentIssues().catch(console.error);
