const mongoose = require('mongoose');
const Order = require('./db/order');
require('dotenv').config();

async function showPaymentFields() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'e-comm-store-db' });
        console.log('🔍 Checking payment fields in database...\n');
        
        const orders = await Order.find().sort({ _id: -1 }).limit(5);
        
        console.log(`Found ${orders.length} recent orders:\n`);
        
        orders.forEach((order, index) => {
            console.log(`📦 ORDER ${index + 1}:`);
            console.log(`   Order ID: ${order._id}`);
            console.log(`   User ID: ${order.userId}`);
            console.log(`   Date: ${order.date}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   💳 PAYMENT FIELDS:`);
            console.log(`      Payment Type: ${order.paymentType}`);
            console.log(`      Payment Intent ID: ${order.paymentIntentId}`);
            console.log(`      Payment Status: ${order.paymentStatus}`);
            console.log(`   📦 Order Details:`);
            console.log(`      Items Count: ${order.items?.length || 0}`);
            console.log(`      Address: ${order.address?.city || 'N/A'}`);
            console.log('   ─────────────────────────────────────\n');
        });
        
        // Show what fields are available in the schema
        console.log('📋 Available Payment Fields in Schema:');
        console.log('   • paymentType (String) - Type of payment method');
        console.log('   • paymentIntentId (String) - Stripe Payment Intent ID');
        console.log('   • paymentStatus (String) - Payment status (paid/pending/failed)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

showPaymentFields();
