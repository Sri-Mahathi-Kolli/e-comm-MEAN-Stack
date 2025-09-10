// Test to verify navigation links are included in chatbot responses
const ChatbotService = require('./backend/services/chatbot.service');

async function testNavigationLinks() {
    console.log('🔗 Testing Navigation Links in Chatbot Responses...\n');
    
    const userId = '68ad87b90ad1c1fae56ffff4'; // Test user ID
    
    // Test different handlers that should have navigation links
    const testCases = [
        {
            method: 'handleAddressChange',
            description: 'Address Change Handler'
        },
        {
            method: 'handlePaymentUpdate', 
            description: 'Payment Update Handler'
        },
        {
            method: 'handleContactInfo',
            description: 'Contact Info Handler'
        },
        {
            method: 'handleReturnPolicy',
            description: 'Return Policy Handler'
        },
        {
            method: 'handleShippingInfo',
            description: 'Shipping Info Handler'
        }
    ];
    
    for (const testCase of testCases) {
        try {
            console.log(`📝 Testing: ${testCase.description}`);
            
            let response;
            if (testCase.method === 'handleAddressChange' || testCase.method === 'handlePaymentUpdate') {
                response = ChatbotService[testCase.method](userId);
            } else {
                response = ChatbotService[testCase.method]();
            }
            
            console.log(`✅ Response type: ${response.type}`);
            
            if (response.suggestions && Array.isArray(response.suggestions)) {
                const hasNavigationLinks = response.suggestions.some(suggestion => 
                    typeof suggestion === 'object' && 
                    suggestion.action === 'navigate' && 
                    suggestion.route
                );
                
                if (hasNavigationLinks) {
                    console.log('🎯 SUCCESS: Contains navigation links!');
                    
                    // Show navigation links
                    const navLinks = response.suggestions.filter(s => 
                        typeof s === 'object' && s.action === 'navigate'
                    );
                    console.log('🔗 Navigation Links:');
                    navLinks.forEach(link => {
                        console.log(`   • ${link.text} → ${link.route}`);
                    });
                } else {
                    console.log('⚠️  No navigation links found');
                }
            } else {
                console.log('❌ No suggestions array found');
            }
            
            console.log('---\n');
        } catch (error) {
            console.log(`❌ Error testing ${testCase.description}: ${error.message}\n`);
        }
    }
}

// Run the test
testNavigationLinks().catch(console.error);
