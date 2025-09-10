const Payment = require('../db/payment');

// Initialize Stripe only if the key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY not found in environment variables');
}

// Create a payment record with detailed information
async function createPaymentRecord(userId, orderId, paymentIntent, amount) {
    try {
        if (!stripe) {
            throw new Error('Stripe not configured');
        }
        
        // Get detailed payment information from Stripe
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        
        const paymentData = {
            userId: userId,
            orderId: orderId,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            currency: paymentIntent.currency,
            paymentMethod: 'card',
            paymentStatus: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
            stripePaymentMethodId: paymentIntent.payment_method,
            paymentDetails: {
                cardLast4: paymentMethod.card?.last4,
                cardBrand: paymentMethod.card?.brand,
                cardExpMonth: paymentMethod.card?.exp_month,
                cardExpYear: paymentMethod.card?.exp_year
            },
            transactionDate: new Date(paymentIntent.created * 1000),
            receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
            metadata: {
                stripeChargeId: paymentIntent.charges?.data[0]?.id,
                paymentIntentStatus: paymentIntent.status
            }
        };
        
        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();
        
        console.log('💳 Payment record created:', savedPayment._id);
        return savedPayment;
    } catch (error) {
        console.error('Error creating payment record:', error);
        throw error;
    }
}

// Get payment by order ID
async function getPaymentByOrderId(orderId) {
    try {
        return await Payment.findOne({ orderId: orderId });
    } catch (error) {
        console.error('Error fetching payment:', error);
        throw error;
    }
}

// Get all payments for a user
async function getUserPayments(userId) {
    try {
        return await Payment.find({ userId: userId }).sort({ transactionDate: -1 });
    } catch (error) {
        console.error('Error fetching user payments:', error);
        throw error;
    }
}

// Update payment status
async function updatePaymentStatus(paymentIntentId, status) {
    try {
        return await Payment.findOneAndUpdate(
            { paymentIntentId: paymentIntentId },
            { paymentStatus: status },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
}

module.exports = {
    createPaymentRecord,
    getPaymentByOrderId,
    getUserPayments,
    updatePaymentStatus
};
