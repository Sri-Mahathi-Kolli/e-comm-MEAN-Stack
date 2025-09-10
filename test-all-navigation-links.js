// Comprehensive test for all navigation links in chatbot responses
const ChatbotService = require('./backend/services/chatbot.service');

async function testAllNavigationLinks() {
    console.log('🌐 Testing ALL Navigation Links in Chatbot Responses...\n');
    
    const userId = '68ad87b90ad1c1fae56ffff4'; // Test user ID
    
    // Test cases with expected navigation links
    const testCases = [
        {
            method: 'handleAddressChange',
            params: [userId],
            description: 'Address Change Handler',
            expectedRoutes: ['/profile', '/profile/addresses', '/profile/payment-methods', '/contact', '/orders']
        },
        {
            method: 'handlePaymentUpdate', 
            params: [userId],
            description: 'Payment Update Handler',
            expectedRoutes: ['/profile/payment-methods', '/profile', '/contact']
        },
        {
            method: 'handleContactInfo',
            params: [],
            description: 'Contact Info Handler',
            expectedRoutes: ['/contact', '/faq', '/orders']
        },
        {
            method: 'handleReturnPolicy',
            params: [],
            description: 'Return Policy Handler',
            expectedRoutes: ['/contact', '/orders', '/returns']
        },
        {
            method: 'handleShippingInfo',
            params: [],
            description: 'Shipping Info Handler',
            expectedRoutes: ['/orders', '/shipping', '/contact']
        },
        {
            method: 'handlePaymentIssues',
            params: [userId],
            description: 'Payment Issues Handler',
            expectedRoutes: ['/contact', '/profile/payment-methods', '/orders', '/faq']
        },
        {
            method: 'handleCartInquiry',
            params: [userId],
            description: 'Cart Inquiry Handler',
            expectedRoutes: ['/checkout', '/cart', '/products'] // For non-empty cart scenario
        },
        {
            method: 'handleWishlistInquiry',
            params: [userId],
            description: 'Wishlist Inquiry Handler',
            expectedRoutes: ['/wishlist', '/products'] // For non-empty wishlist scenario
        }
    ];
    
    let totalSuccesses = 0;
    let totalTests = testCases.length;
    
    for (const testCase of testCases) {
        try {
            console.log(`📝 Testing: ${testCase.description}`);
            
            let response;
            if (testCase.params.length > 0) {
                response = await ChatbotService[testCase.method](...testCase.params);
            } else {
                response = ChatbotService[testCase.method]();
            }
            
            console.log(`✅ Response type: ${response.type}`);
            
            if (response.suggestions && Array.isArray(response.suggestions)) {
                const navigationLinks = response.suggestions.filter(suggestion => 
                    typeof suggestion === 'object' && 
                    suggestion.action === 'navigate' && 
                    suggestion.route
                );
                
                if (navigationLinks.length > 0) {
                    console.log('🎯 SUCCESS: Contains navigation links!');
                    console.log('🔗 Found Navigation Links:');
                    
                    navigationLinks.forEach(link => {
                        console.log(`   • ${link.text} → ${link.route}`);
                    });
                    
                    // Check if expected routes are present
                    const foundRoutes = navigationLinks.map(link => link.route);
                    const hasExpectedRoutes = testCase.expectedRoutes.some(expectedRoute => 
                        foundRoutes.includes(expectedRoute)
                    );
                    
                    if (hasExpectedRoutes) {
                        console.log('✅ Contains expected navigation routes!');
                        totalSuccesses++;
                    } else {
                        console.log('⚠️  Missing some expected routes');
                        console.log(`   Expected: ${testCase.expectedRoutes.join(', ')}`);
                        console.log(`   Found: ${foundRoutes.join(', ')}`);
                    }
                } else {
                    console.log('❌ No navigation links found');
                }
                
                // Check for message actions
                const messageActions = response.suggestions.filter(suggestion => 
                    typeof suggestion === 'object' && 
                    suggestion.action === 'message'
                );
                
                if (messageActions.length > 0) {
                    console.log('💬 Message Actions:');
                    messageActions.forEach(action => {
                        console.log(`   • ${action.text} → "${action.message}"`);
                    });
                }
            } else {
                console.log('❌ No suggestions array found');
            }
            
            console.log('---\n');
        } catch (error) {
            console.log(`❌ Error testing ${testCase.description}: ${error.message}\n`);
        }
    }
    
    // Summary
    console.log('📊 SUMMARY:');
    console.log(`✅ Successful Tests: ${totalSuccesses}/${totalTests}`);
    console.log(`📈 Success Rate: ${((totalSuccesses/totalTests) * 100).toFixed(1)}%`);
    
    if (totalSuccesses === totalTests) {
        console.log('🎉 ALL NAVIGATION LINKS WORKING PERFECTLY!');
    } else {
        console.log('⚠️  Some handlers need attention');
    }
}

// Run the comprehensive test
testAllNavigationLinks().catch(console.error);
