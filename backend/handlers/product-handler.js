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
    let products = await Product.find();
    return products.map(x => x.toObject());
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
        queryFilter.$or = [
            { name: { $regex: '.*' + searchTerm + '.*', $options: 'i' } },
            { shortDescription: { $regex: '.*' + searchTerm + '.*', $options: 'i' } }
        ];
    }
    if (categoryId) {
        queryFilter.categoryId = categoryId;
    }
    if (brandId) {
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


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    getNewProducts,
    getFeaturedProducts,
    getProductForListing
}