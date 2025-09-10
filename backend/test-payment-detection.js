require('dotenv').config();
const chatbotService = require('./services/chatbot.service');

async function testPaymentHistory() {
    console.log('Testing payment history detection...');
    
    const testMessages = [
        "View payment history",
        "payment history", 
        "show my payments",
        "payment methods"
    ];
    
    for (const message of testMessages) {
        console.log(`\nTesting: "${message}"`);
        try {
            const response = await chatbotService.processUserMessage(message, null);
            console.log(`Intent result: ${response.type}`);
            console.log(`Message: ${response.message.substring(0, 80)}...`);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
}

testPaymentHistory();
