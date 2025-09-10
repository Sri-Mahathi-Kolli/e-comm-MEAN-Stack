# Production Deployment Checklist

## Backend (.env file):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/e-comm-store-db
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
NODE_ENV=production
PORT=3000
```

## Frontend Environment:
- Production API URL should point to your deployed backend
- Stripe test keys are already configured

## CORS Configuration:
✅ Configured to accept requests from:
- localhost (development)
- Vercel deployments
- Netlify deployments
- Heroku deployments

## Security Features:
✅ Security headers added for production
✅ Error handling for production vs development
✅ CORS protection
✅ Request size limits
✅ Static file serving for uploads

## API Endpoints:
✅ All routes protected with authentication where needed
✅ Health check endpoint: /health
✅ CORS preflight handling
✅ 404 error handling

## Testing in Production:
1. Test all API endpoints
2. Test Stripe payment with test cards
3. Test file uploads
4. Test authentication flows
5. Check CORS from frontend domain

## Deployment URLs to Add to CORS:
- Add your Vercel URL: https://your-app.vercel.app
- Add your Netlify URL: https://your-app.netlify.app
- Add your custom domain if any

## Test Cards for Production (Test Mode):
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Expiry: Any future date (12/34)
- CVC: Any 3 digits (123)
- ZIP: Any postal code (12345)
