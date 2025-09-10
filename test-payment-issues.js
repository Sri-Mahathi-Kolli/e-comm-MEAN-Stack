// Simple test for payment issues using built-in modules
const http = require('http');

async function testPaymentIssues() {
    console.log('🧪 Testing Payment Issues Functionality...\n');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWQ4N2I5MGFkMWMxZmFlNTZmZmZmNCIsImVtYWlsIjoicmFraUBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzU2NzY2OTQ4LCJleHAiOjE3NTY3NzA1NDh9.aGMpAhbzDLJNXv_02r5KfnNWZJ8LfqDx6_rCJvfFa-g';
    
    const testMessage = 'payment problem';
    const postData = JSON.stringify({ message: testMessage });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/chatbot/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log(`📝 Testing: "${testMessage}"`);
                    console.log(`✅ Response type: ${response.type}`);
                    console.log(`📋 Message: ${response.message.substring(0, 150)}...`);
                    
                    if (response.type === 'payment_issues') {
                        console.log('🎯 SUCCESS: Correctly detected as payment_issues!');
                        console.log('✅ Payment issues functionality is working correctly!');
                    } else {
                        console.log(`⚠️  Expected payment_issues, got: ${response.type}`);
                        console.log('❌ Payment issues detection needs improvement');
                    }
                    
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ Request error: ${error.message}`);
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

// Run the test
testPaymentIssues().catch(console.error);
