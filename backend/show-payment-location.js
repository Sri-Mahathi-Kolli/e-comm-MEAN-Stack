const mongoose = require('mongoose');
require('dotenv').config();

async function showPaymentLocation() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'e-comm-store-db' });
        
        console.log('🔍 WHERE TO FIND PAYMENT DETAILS:\n');
        
        // Show all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📋 Your Database Collections:');
        collections.forEach(col => {
            console.log(`   • ${col.name}`);
        });
        
        console.log('\n💡 IMPORTANT: Payment details are stored in the "orders" collection, NOT in a separate payments table!\n');
        
        // Show orders collection with payment fields
        const ordersCollection = mongoose.connection.db.collection('orders');
        const orderWithPayment = await ordersCollection.findOne(
            { paymentIntentId: { $exists: true, $ne: null } },
            { projection: { paymentType: 1, paymentIntentId: 1, paymentStatus: 1, status: 1, date: 1, userId: 1 } }
        );
        
        if (orderWithPayment) {
            console.log('📦 EXAMPLE ORDER WITH PAYMENT DATA:');
            console.log('   Collection: orders');
            console.log('   Document Structure:');
            console.log(`   {`);
            console.log(`     "_id": "${orderWithPayment._id}",`);
            console.log(`     "userId": "${orderWithPayment.userId}",`);
            console.log(`     "paymentType": "${orderWithPayment.paymentType}",`);
            console.log(`     "paymentIntentId": "${orderWithPayment.paymentIntentId}",`);
            console.log(`     "paymentStatus": "${orderWithPayment.paymentStatus}",`);
            console.log(`     "status": "${orderWithPayment.status}",`);
            console.log(`     "date": "${orderWithPayment.date}"`);
            console.log(`   }`);
        } else {
            console.log('❌ No orders with payment data found');
        }
        
        // Count orders with and without payment data
        const totalOrders = await ordersCollection.countDocuments();
        const paidOrders = await ordersCollection.countDocuments({ paymentStatus: 'paid' });
        const cardOrders = await ordersCollection.countDocuments({ paymentType: 'card' });
        
        console.log('\n📊 PAYMENT STATISTICS:');
        console.log(`   Total Orders: ${totalOrders}`);
        console.log(`   Paid Orders: ${paidOrders}`);
        console.log(`   Card Payments: ${cardOrders}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

showPaymentLocation();
