const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send order confirmation email
const sendOrderConfirmation = async (customerEmail, orderDetails) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: `Order Confirmation - #${orderDetails.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Thank you for your order!</h2>
                    <p>Hi ${orderDetails.customerName || 'Valued Customer'},</p>
                    <p>We've received your order and are processing it now.</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                        <p><strong>Order Date:</strong> ${new Date(orderDetails.date).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
                        <p><strong>Payment Method:</strong> ${orderDetails.paymentType}</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Items Ordered</h3>
                        ${orderDetails.items.map(item => `
                            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                                <p><strong>${item.product.name}</strong></p>
                                <p>Quantity: ${item.quantity} | Price: $${item.sellingPrice}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Shipping Address</h3>
                        <p>${orderDetails.address.address1}</p>
                        ${orderDetails.address.address2 ? `<p>${orderDetails.address.address2}</p>` : ''}
                        <p>${orderDetails.address.city}, ${orderDetails.address.pincode}</p>
                    </div>
                    
                    <p>We'll send you another email when your order ships.</p>
                    <p>Thank you for shopping with us!</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                        <p>If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

// Send payment failure notification
const sendPaymentFailureNotification = async (customerEmail, orderDetails) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Payment Issue - Action Required',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d32f2f;">Payment Issue</h2>
                    <p>Hi ${orderDetails.customerName || 'Valued Customer'},</p>
                    <p>We encountered an issue processing your payment for order #${orderDetails.orderId}.</p>
                    
                    <div style="background: #ffebee; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #d32f2f;">
                        <p><strong>What happened:</strong> Your payment could not be processed successfully.</p>
                        <p><strong>Next steps:</strong> Please try placing your order again or contact our support team.</p>
                    </div>
                    
                    <p>We apologize for any inconvenience.</p>
                    <p>If you continue to experience issues, please contact our support team.</p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Payment failure notification sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending payment failure notification:', error);
        throw error;
    }
};

module.exports = {
    sendOrderConfirmation,
    sendPaymentFailureNotification
};
