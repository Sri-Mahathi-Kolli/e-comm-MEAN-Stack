# Render Deployment Guide

## 🚀 Backend Deployment on Render

### Option 1: Using render.yaml (Recommended)
1. The `render.yaml` file is already configured in the root
2. Connect your GitHub repository to Render
3. Create a new "Web Service" and select "Use render.yaml"
4. Set the following environment variables manually in Render dashboard:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `EMAIL_USER`: Your email for notifications
   - `EMAIL_PASS`: Your email app password

### Option 2: Manual Setup
1. Create a new "Web Service" on Render
2. Connect your GitHub repository
3. **Root Directory**: Leave empty (uses repository root)
4. **Build Command**: `npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxxxx.mongodb.net/e-comm-store-db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-jwt-secret-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ALLOWED_ORIGINS=https://e-comm-mean-stack.vercel.app,https://saarvi.vercel.app,https://e-comm-mean-stack.onrender.com
   FRONTEND_URL=https://saarvi.vercel.app
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

### Option 3: Deploy Backend Only (If issues persist)
If the root deployment doesn't work:
1. Create a new service
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Use the same environment variables as above

## 🔧 Troubleshooting

### Common Issues:
1. **502 Bad Gateway**: Backend server not starting
   - Check Render logs
   - Verify all environment variables are set
   - Ensure MongoDB connection is working

2. **Build Failures**: 
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

3. **CORS Errors**:
   - Verify ALLOWED_ORIGINS includes your frontend URL
   - Check that Render backend URL is added to CORS

### Debugging Steps:
1. Check Render service logs in dashboard
2. Verify health check at: `https://your-backend.onrender.com/health`
3. Test direct API calls from Postman
4. Verify MongoDB connection string

## 📱 Frontend Configuration

Update your frontend environment files to point to your Render backend:

**webapp/src/environments/environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend.onrender.com'
};
```

## 🔄 Redeployment

After making changes:
1. Push to your GitHub repository
2. Render will automatically redeploy
3. Check the deployment logs
4. Test the API endpoints

## ⚡ Performance Notes

- Render free tier has cold starts (can take 30-60 seconds to wake up)
- Consider upgrading to paid tier for production use
- Monitor your service logs for any errors
