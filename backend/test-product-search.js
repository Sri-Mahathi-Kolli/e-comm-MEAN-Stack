// Test product search functionality
require('dotenv').config();

async function testProductSearch() {
    try {
        // Mock the Product model for testing
        const Product = {
            find: (query) => {
                console.log('📊 Database query:', JSON.stringify(query, null, 2));
                
                // Simulate your skincare product
                const mockProducts = [
                    {
                        _id: '507f1f77bcf86cd799439011',
                        name: 'Vitamin C Serum',
                        shotDescription: 'Brightening skincare serum',
                        description: 'Premium vitamin C skincare serum for bright, healthy skin',
                        Price: 29.99,
                        discount: 10,
                        images: ['serum1.jpg'],
                        categoryId: { name: 'Skincare' },
                        brandId: { name: 'BeautyBrand' },
                        isFeatured: true,
                        isNewProduct: false,
                        toObject: function() { return this; }
                    }
                ];
                
                return {
                    populate: () => ({
                        populate: () => ({
                            limit: () => ({
                                sort: () => Promise.resolve(mockProducts)
                            })
                        })
                    })
                };
            }
        };

        // Test the search logic
        async function testGetProductsByQuery(searchTerm, limit = 10) {
            console.log('🔍 Searching for products with term:', searchTerm);
            
            if (!searchTerm || searchTerm.trim() === '') {
                console.log('No search term provided');
                return [];
            }

            const searchRegex = new RegExp(searchTerm.trim(), 'i');
            
            let queryFilter = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { shotDescription: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            };

            console.log('Query filter:', JSON.stringify(queryFilter, null, 2));
            
            const products = await Product.find(queryFilter)
                .populate('categoryId', 'name')
                .populate('brandId', 'name')
                .limit(limit)
                .sort({ createdAt: -1 });

            console.log(`Found ${products.length} products`);
            
            return products.map(product => ({
                ...product,
                category: product.categoryId,
                brand: product.brandId
            }));
        }

        // Test various search terms
        const searchTerms = [
            'skincare',
            'skin',
            'serum',
            'vitamin',
            'beauty',
            'brightening',
            'care'
        ];

        console.log('🧪 Testing Product Search Functionality\n');

        for (const term of searchTerms) {
            console.log(`\n--- Testing search term: "${term}" ---`);
            const results = await testGetProductsByQuery(term);
            console.log(`Results: ${results.length} products found`);
            
            if (results.length > 0) {
                results.forEach(product => {
                    console.log(`✅ Found: ${product.name} - ${product.shotDescription}`);
                });
            } else {
                console.log('❌ No products found');
            }
        }

        console.log('\n🎯 Recommendations:');
        console.log('1. The search should work for "skincare", "skin", "serum", etc.');
        console.log('2. Make sure your database has products with these terms in name/description');
        console.log('3. Check that the database connection and collection name are correct');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testProductSearch();
