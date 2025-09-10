require('dotenv').config();
const chatbotService = require('./services/chatbot.service');

async function testPaymentMethods() {
    console.log('Testing payment methods without login...');
    
    const response = await chatbotService.processUserMessage('payment methods', null);
    console.log('Response type:', response.type);
    console.log('Message:', response.message);
    if (response.data) {
        console.log('Payment methods:', response.data);
    }
    if (response.suggestions) {
        console.log('Suggestions:', response.suggestions);
    }
}

testPaymentMethods();
