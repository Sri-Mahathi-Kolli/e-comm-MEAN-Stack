const express = require('express');
const router = express.Router();
const Order = require('../db/order');

// Get all orders with payment details for admin verification
router.get('/verify-orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ _id: -1 })
            .limit(10)
            .populate('userId', 'email');
        
        const orderDetails = orders.map(order => ({
            orderId: order._id,
            userEmail: order.userId?.email || 'Unknown',
            paymentType: order.paymentType,
            paymentIntentId: order.paymentIntentId,
            paymentStatus: order.paymentStatus,
            status: order.status,
            date: order.date,
            totalItems: order.items?.length || 0,
            address: order.address,
            cancellationReason: order.cancellationReason || '',
        }));
        
        res.json({
            success: true,
            totalOrders: orderDetails.length,
            orders: orderDetails
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch orders',
            message: error.message 
        });
    }
});

// Get specific order by ID
router.get('/order/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'email');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({
            success: true,
            order: {
                orderId: order._id,
                userEmail: order.userId?.email || 'Unknown',
                paymentType: order.paymentType,
                paymentIntentId: order.paymentIntentId,
                paymentStatus: order.paymentStatus,
                status: order.status,
                date: order.date,
                items: order.items,
                address: order.address
                    ,
                    cancellationReason: order.cancellationReason || ''
            }
        });
// Cancel an order by ID (admin only)
router.post('/order/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
                const reason = req.body.reason || '';
                console.log('Saving cancellation reason:', reason);
                const updatedOrder = await Order.findByIdAndUpdate(
                    req.params.id,
                    { status: 'Cancelled', cancellationReason: reason },
                    { new: true }
                );
                res.json({ success: true, message: 'Order cancelled', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel order', message: error.message });
    }
});
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ 
            error: 'Failed to fetch order',
            message: error.message 
        });
    }
});

module.exports = router;
