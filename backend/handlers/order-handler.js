const Order = require("./../db/order");

async function addOrder(userId, orderModel) {
    console.log('Creating order for user:', userId, 'with data:', orderModel);
    let order = new Order({
        ...orderModel,
        userId: userId,
        status: "inprogress",
        date: new Date()
    });
    
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder._id);
    return savedOrder;
}


async function getCustomerOrders(userId) {
    let orders = await Order.find({ userId: userId });
    return orders.map((x) => {
        const obj = x.toObject();
        obj.cancellationReason = x.cancellationReason || '';
        return obj;
    });
}

async function getOrders(){
     let orders = await Order.find();
    return orders.map((x) => {
        const obj = x.toObject();
        obj.cancellationReason = x.cancellationReason || '';
        return obj;
    });
}
async function updateOrderStatus(id,status) {
    await Order.findByIdAndUpdate(id,{
        status:status,
    });
}

async function getUserOrders(userId) {
    return await getCustomerOrders(userId);
}

async function cancelCustomerOrder(userId, orderId) {
    // First verify that the order belongs to the user and is cancellable
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
        throw new Error('Order not found or does not belong to user');
    }

    // Check if order can be cancelled (not shipped, delivered, or already cancelled)
    const status = order.status?.toLowerCase();
    if (status === 'shipped' || status === 'delivered' || status === 'cancelled') {
        throw new Error('Order cannot be cancelled');
    }

    // Accept reason as third argument
    const reason = arguments.length > 2 ? arguments[2] : '';

    // Update order status to cancelled and save reason
    await Order.findByIdAndUpdate(orderId, {
        status: 'Cancelled',
        cancellationReason: reason
    });

    return { message: 'Order cancelled successfully' };
}

async function adminCancelOrder(orderId, reason) {
    // Find the order (admin can cancel any order)
    const order = await Order.findById(orderId);
    
    if (!order) {
        throw new Error('Order not found');
    }
    
    // Check if order can be cancelled (not delivered or already cancelled)
    const status = order.status?.toLowerCase();
    if (status === 'delivered' || status === 'cancelled') {
        throw new Error('Order cannot be cancelled (already delivered or cancelled)');
    }
    
    // Update order status to cancelled with reason
    await Order.findByIdAndUpdate(orderId, {
        status: 'Cancelled',
        cancellationReason: reason,
        cancelledBy: 'admin',
        cancelledAt: new Date()
    });
    
    return { 
        message: 'Order cancelled successfully by admin',
        reason: reason 
    };
}

module.exports={addOrder,getCustomerOrders,getOrders,updateOrderStatus,getUserOrders,cancelCustomerOrder,adminCancelOrder}