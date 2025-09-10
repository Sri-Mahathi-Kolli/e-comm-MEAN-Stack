
const Product = require("./../db/product");

async function addProduct(model) {
    let product = new Product({
        ...model
    });
    await product.save();
    return product.toObject();
}

async function updateProduct(id, model) {
    await Product.findByIdAndUpdate(id, model);
}

async function deleteProduct(id) {
    await Product.findByIdAndDelete(id);
}

async function getAllProducts() {
    try {
        console.log('📦 Getting all products from database...');
        
        // Try with populate first, fallback without if schemas not available
        let products;
        try {
            products = await Product.find()
                .populate('categoryId', 'name')
                .populate('brandId', 'name');
        } catch (populateError) {
            console.log('⚠️ Populate failed, getting products without populate:', populateError.message);
            products = await Product.find();
        }
        
        console.log(`📦 Found ${products.length} total products`);
        
        const result = products.map(product => {
            const productObj = product.toObject();
            return {
                ...productObj,
                categoryName: productObj.categoryId?.name || 'Uncategorized',
                brandName: productObj.brandId?.name || 'No Brand',
                // Keep original for backward compatibility
                category: productObj.categoryId,
                brand: productObj.brandId
            };
        });
        
        console.log('📦 Products retrieved:', result.map(p => ({ name: p.name, categoryName: p.categoryName })));
        return result;
    } catch (error) {
        console.error('❌ Error getting all products:', error);
        return [];
    }
}

async function getProduct(id) {
    let product = await Product.findById(id);
    return product.toObject();
}

async function getNewProducts() {
    let newProducts = await Product.find({
        isNewProduct: true,
    });
    return newProducts.map((x) => x.toObject());
}

async function getFeaturedProducts() {
    let featuredProducts = await Product.find({
        isFeatured: true,
    });
    return featuredProducts.map((x) => x.toObject());
}

async function getProductForListing(searchTerm, categoryId, page, pageSize, sortBy, sortOrder, brandId) {
    if (!sortBy || sortBy.trim() === '') {
        sortBy = null; // no sorting if empty
    }
    if (!sortOrder) {
        sortOrder = -1;
    } else {
        sortOrder = (sortOrder === '-1' || sortOrder === -1) ? -1 : 1;
    }

    let queryFilter = {};

    if (searchTerm) {
        // Match any substring in name, shortDescription, or description
        const pattern = new RegExp(searchTerm, 'i');
        queryFilter.$or = [
            { name: { $regex: pattern } },
            { shortDescription: { $regex: pattern } },
            { description: { $regex: pattern } }
        ];
    }
    if (categoryId && categoryId !== 'all') {
        queryFilter.categoryId = categoryId;
    }
    if (brandId && brandId !== 'all' && brandId !== '') {
        queryFilter.brandId = brandId;
    }

    console.log("queryFilter", queryFilter);

    let query = Product.find(queryFilter);

    if (sortBy) {
        let sortObj = {};
        sortObj[sortBy] = sortOrder;
        query = query.sort(sortObj);
    }

    query = query.skip((+page - 1) * +pageSize).limit(+pageSize);

    const products = await query;

    return products.map(x => x.toObject());
}

// Search products by query
async function getProductsByQuery(searchTerm, limit = 10) {
    console.log('🔍 Searching for products with term:', searchTerm);
    
    try {
        // If no search term, return all products
        if (!searchTerm || searchTerm.trim() === '') {
            console.log('No search term, returning all products');
            return await getAllProducts();
        }

        // Clean and prepare search term
        const cleanSearchTerm = searchTerm.trim().toLowerCase();
        console.log('Clean search term:', cleanSearchTerm);
        
        // Create multiple search patterns for better matching
        const searchPatterns = [
            new RegExp(cleanSearchTerm, 'i'),                    // Exact term
            new RegExp(cleanSearchTerm.replace(/\s+/g, '.*'), 'i'), // Words can be separated
            new RegExp(`.*${cleanSearchTerm}.*`, 'i')            // Contains the term
        ];
        
        // Try each pattern
        let products = [];
        for (const pattern of searchPatterns) {
            console.log('Trying pattern:', pattern);
            
            const queryFilter = {
                $or: [
                    { name: { $regex: pattern } },
                    { shotDescription: { $regex: pattern } },
                    { description: { $regex: pattern } }
                ]
            };
            
            console.log('Query filter:', JSON.stringify(queryFilter, null, 2));
            
            // Try with populate first, fallback without if schemas not available
            try {
                products = await Product.find(queryFilter)
                    .populate('categoryId', 'name')
                    .populate('brandId', 'name')
                    .limit(limit)
                    .sort({ createdAt: -1 });
            } catch (populateError) {
                console.log('⚠️ Populate failed, searching without populate:', populateError.message);
                products = await Product.find(queryFilter)
                    .limit(limit)
                    .sort({ createdAt: -1 });
            }
            
            console.log(`Pattern ${pattern} found ${products.length} products`);
            
            if (products.length > 0) {
                break; // Found results, stop trying other patterns
            }
        }
        
        // If still no results, try a very broad search
        if (products.length === 0) {
            console.log('No results with patterns, trying broad search...');
            // Try with populate first, fallback without if schemas not available
            try {
                products = await Product.find({})
                    .populate('categoryId', 'name')
                    .populate('brandId', 'name')
                    .limit(limit);
            } catch (populateError) {
                console.log('⚠️ Populate failed, broad search without populate:', populateError.message);
                products = await Product.find({})
                    .limit(limit);
            }
            
            console.log(`Broad search found ${products.length} products`);
        }
        
        const result = products.map(product => {
            const productObj = product.toObject();
            return {
                ...productObj,
                categoryName: productObj.categoryId?.name || 'Uncategorized',
                brandName: productObj.brandId?.name || 'No Brand',
                category: productObj.categoryId,
                brand: productObj.brandId
            };
        });
        
        console.log('Final results:', result.map(p => p.name));
        return result;
        
    } catch (error) {
        console.error('Error searching products:', error);
        
        // Fallback: try to return all products
        try {
            console.log('Error occurred, falling back to all products...');
            return await getAllProducts();
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return [];
        }
    }
}

async function getProductById(id) {
    try {
        console.log('📦 Getting product by ID:', id);
        
        // Try with populate first, fallback without if schemas not available
        let product;
        try {
            product = await Product.findById(id)
                .populate('categoryId', 'name')
                .populate('brandId', 'name');
        } catch (populateError) {
            console.log('⚠️ Populate failed, getting product without populate:', populateError.message);
            product = await Product.findById(id);
        }
        
        if (!product) {
            console.log('❌ Product not found');
            return null;
        }
        
        console.log('✅ Product found:', product.name);
        const productObj = product.toObject();
        return {
            ...productObj,
            categoryName: productObj.categoryId?.name || 'Uncategorized',
            brandName: productObj.brandId?.name || 'No Brand'
        };
    } catch (error) {
        console.error('Error getting product by ID:', error);
        return null;
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    getNewProducts,
    getFeaturedProducts,
    getProductForListing,
    getProductsByQuery,
    getProductById
}