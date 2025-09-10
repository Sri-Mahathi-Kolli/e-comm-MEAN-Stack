const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, createCheckoutSession } = require('../handlers/stripe-handler');
const { addOrder } = require('../handlers/order-handler');
const { clearCart } = require('../handlers/shopping-cart-handler');
const { createPaymentRecord, getUserPayments, getPaymentByOrderId } = require('../handlers/payment-handler');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Creating payment intent for amount:', amount);
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const paymentIntent = await createPaymentIntent(amount);
        console.log('Payment intent created:', paymentIntent.id);
        
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// Process order with Stripe payment
router.post('/process-order', async (req, res) => {
    try {
        const userId = req.user.id;
        const { order, paymentIntentId } = req.body;
        console.log('Processing order for user:', userId, 'payment intent:', paymentIntentId);
        console.log('Order data received:', JSON.stringify(order, null, 2));
        
        // Verify the payment with Stripe
        const paymentIntent = await confirmPayment(paymentIntentId);
        console.log('Payment intent status:', paymentIntent.status);
        
        if (paymentIntent.status === 'succeeded') {
            // Payment successful, create the order
            const orderData = {
                ...order,
                paymentType: 'card',
                paymentIntentId: paymentIntentId,
                paymentStatus: 'paid'
            };
            
            console.log('Creating order with payment data:', JSON.stringify(orderData, null, 2));
            const savedOrder = await addOrder(userId, orderData);
            
            // Create detailed payment record in payments collection
            try {
                const totalAmount = order.items.reduce((total, item) => {
                    const itemPrice = item.product.Price * (1 - item.product.discount / 100);
                    return total + (itemPrice * item.quantity);
                }, 0);
                
                await createPaymentRecord(userId, savedOrder._id, paymentIntent, totalAmount);
                console.log('💳 Detailed payment record created in payments collection');
            } catch (paymentRecordError) {
                console.error('Warning: Failed to create payment record:', paymentRecordError.message);
                // Don't fail the order if payment record creation fails
            }
            
            await clearCart(userId);
            
            console.log('Order created successfully with ID:', savedOrder._id);
            res.json({
                success: true,
                message: 'Order created successfully',
                orderId: savedOrder._id,
                order: savedOrder
            });
        } else {
            console.log('Payment not successful, status:', paymentIntent.status);
            res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process order',
            message: error.message 
        });
    }
});

// Create checkout session (alternative approach)
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, successUrl, cancelUrl } = req.body;
        
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    images: item.product.images,
                },
                unit_amount: Math.round(item.sellingPrice * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        const session = await createCheckoutSession(lineItems, successUrl, cancelUrl);
        
        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Get user's payment history
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await getUserPayments(userId);
        
        res.json({
            success: true,
            payments: payments.map(payment => ({
                paymentId: payment._id,
                orderId: payment.orderId,
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                cardDetails: payment.paymentDetails,
                transactionDate: payment.transactionDate,
                receiptUrl: payment.receiptUrl
            }))
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch payment history' 
        });
    }
});

// Get payment details for specific order
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await getPaymentByOrderId(orderId);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                error: 'Payment not found for this order' 
            });
        }
        
        res.json({
            success: true,
            payment: {
                paymentId: payment._id,
                orderId: payment.orderId,
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                cardDetails: payment.paymentDetails,
                transactionDate: payment.transactionDate,
                receiptUrl: payment.receiptUrl,
                stripePaymentIntentId: payment.paymentIntentId
            }
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch payment details' 
        });
    }
});

module.exports = router;
