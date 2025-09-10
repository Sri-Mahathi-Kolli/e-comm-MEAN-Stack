const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
    paymentIntentId: { type: String, required: true }, // Stripe Payment Intent ID
    amount: { type: Number, required: true }, // Amount in dollars
    currency: { type: String, default: 'usd' },
    paymentMethod: { type: String, required: true }, // 'card', 'cash'
    paymentStatus: { type: String, required: true }, // 'pending', 'paid', 'failed', 'refunded'
    stripePaymentMethodId: String, // Stripe payment method ID
    stripeCustomerId: String, // Stripe customer ID if available
    paymentDetails: {
        cardLast4: String,
        cardBrand: String, // visa, mastercard, etc.
        cardExpMonth: Number,
        cardExpYear: Number
    },
    transactionDate: { type: Date, default: Date.now },
    receiptUrl: String, // Stripe receipt URL
    metadata: mongoose.Schema.Types.Mixed // Additional payment metadata
}, {
    timestamps: true
});

const Payment = mongoose.model("payments", paymentSchema);
module.exports = Payment;
