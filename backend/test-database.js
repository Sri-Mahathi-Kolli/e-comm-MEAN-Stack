// Test database connection and product retrieval
require('dotenv').config();
const mongoose = require('mongoose');

async function testDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "e-comm-store-db",
        });
        
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Connection state:', mongoose.connection.readyState);
        console.log('🗃️ Database name:', mongoose.connection.db.databaseName);
        
        // Import Product model
        const Product = require('./db/product');
        
        // Test 1: Count all products
        const totalCount = await Product.countDocuments();
        console.log(`\n📦 Total products in database: ${totalCount}`);
        
        // Test 2: Get all products
        const allProducts = await Product.find();
        console.log(`📦 Retrieved ${allProducts.length} products`);
        
        // Test 3: Show product details
        if (allProducts.length > 0) {
            console.log('\n🔍 Product details:');
            allProducts.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name}`);
                console.log(`   Description: ${product.shotDescription || 'No description'}`);
                console.log(`   Price: $${product.Price}`);
                console.log(`   Category ID: ${product.categoryId}`);
                console.log(`   Brand ID: ${product.brandId}`);
                console.log('---');
            });
        } else {
            console.log('❌ No products found in database!');
            console.log('💡 Make sure you have added products through your admin panel');
        }
        
        // Test 4: Test search functionality
        console.log('\n🔍 Testing search functionality...');
        
        const searchTerms = ['skincare', 'skin', 'care', 'beauty'];
        
        for (const term of searchTerms) {
            const searchRegex = new RegExp(term, 'i');
            const searchResults = await Product.find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { shotDescription: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            });
            
            console.log(`"${term}": ${searchResults.length} results`);
            if (searchResults.length > 0) {
                searchResults.forEach(product => {
                    console.log(`  ✅ ${product.name}`);
                });
            }
        }
        
        // Test 5: Check collections
        console.log('\n📋 Available collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(collection => {
            console.log(`  - ${collection.name}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
}

// Run the test
console.log('🧪 Starting Database Test...\n');
testDatabase();
