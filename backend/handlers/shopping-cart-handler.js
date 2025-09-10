const Cart = require("./../db/cart");



async function addToCart(userId, productId, quantity) {
    try {
        console.log("Incoming quantity:", quantity, "Type:", typeof quantity);

        let product = await Cart.findOne({ userId: userId, productId: productId });
        if (product) {
            if (product.quantity + quantity <= 0) {
                await removefromCart(userId, productId);
                return { success: true, message: "Item removed from cart", quantity: 0 };
            } else {
                const updatedProduct = await Cart.findByIdAndUpdate(product._id, {
                    quantity: product.quantity + quantity
                }, { new: true });
                return { success: true, message: "Cart updated", quantity: updatedProduct.quantity };
            }
        } else {
            const newProduct = new Cart({
                userId: userId,
                productId: productId,
                quantity: quantity,
            });
            await newProduct.save();
            return { success: true, message: "Item added to cart", quantity: quantity };
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, message: "Failed to add item to cart", error: error.message };
    }
}

async function removefromCart(userId, productId) {
    let product = await Cart.findOneAndDelete({ userId: userId, productId: productId });

}

async function getCartItems(userId) {
    const products = await Cart.find({ userId: userId }).populate("productId");
    return products.map((x) => {
        return { quantity: x.quantity, product: x.productId }

    });
}
async function clearCart(userId) {
    await Cart.deleteMany({
        userId: userId,
    });
}

module.exports = { getCartItems, removefromCart, addToCart, clearCart }