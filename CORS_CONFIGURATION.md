# CORS Configuration Guide

## 🌐 Comprehensive Cross-Origin Resource Sharing Setup

Your e-commerce application now has a robust CORS configuration that supports multiple deployment platforms and environments.

## 📋 Supported Origins

### 🔧 Development Origins
- `http://localhost:4200` - Angular dev server (default)
- `http://localhost:4201` - Alternative Angular port
- `http://localhost:4202` - Additional development port
- `http://localhost:3000` - Backend server
- `http://localhost:8080` - Alternative dev server
- `http://127.0.0.1:4200` - IP-based localhost
- `http://127.0.0.1:3000` - IP-based backend

### 🚀 Production Origins

#### Vercel Deployments
- `https://e-comm-mean-stack.vercel.app` - Main Vercel deployment
- `https://saarvi.vercel.app` - Alternative Vercel deployment
- **Dynamic Support**: All `*.vercel.app` domains (preview deployments)

#### Azure Deployments
- `https://calm-beach-03b22131e.azurestaticapps.net` - Azure Static Web App
- `https://witty-coast-00933a01e.azurestaticapps.net` - Alternative Azure Static Web App
- `https://nodejs-backend-1.azurewebsites.net` - Azure App Service
- **Dynamic Support**: All `*.azurestaticapps.net` domains

#### Netlify Deployments (If Used)
- `https://e-comm-mean-stack.netlify.app`
- `https://saarvi.netlify.app`
- **Dynamic Support**: All `*.netlify.app` and `*.netlify.com` domains

#### GitHub Pages (If Used)
- `https://rakesh-sundari.github.io`

#### Custom Domains
- `https://yourdomain.com` - Replace with your actual domain
- `https://www.yourdomain.com` - Replace with your www subdomain

## ⚙️ Environment Variable Configuration

You can dynamically add origins using environment variables:

### Backend `.env` File
```bash
# Add multiple origins separated by commas
ALLOWED_ORIGINS=https://your-new-domain.com,https://staging.yourdomain.com,https://app.yourdomain.com

# Frontend URL for password reset emails
FRONTEND_URL=https://e-comm-mean-stack.vercel.app
```

### Example Usage
```bash
# Development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002

# Production
ALLOWED_ORIGINS=https://production-domain.com,https://api.yourdomain.com
```

## 🔒 CORS Security Features

### ✅ What's Enabled
- **Credentials Support**: Cookies and authentication headers
- **Dynamic Origin Validation**: Automatic support for platform-specific URLs
- **Comprehensive Headers**: All necessary request headers allowed
- **Multiple HTTP Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Preflight Handling**: Proper OPTIONS request support

### 🛡️ Security Measures
- **Origin Validation**: Each request origin is checked
- **Logging**: Suspicious requests are logged
- **Flexible Development**: Auto-allows localhost for development
- **Platform Support**: Auto-allows known deployment platforms

## 🚀 Deployment Platform Support

### Vercel
- ✅ Automatic support for all Vercel preview deployments
- ✅ Production domain configured
- ✅ Environment variable support

### Azure
- ✅ Static Web Apps support
- ✅ App Service support
- ✅ Dynamic subdomain support

### Netlify
- ✅ Automatic support for all Netlify deployments
- ✅ Branch deployments included

### Render
- ✅ Compatible with Render deployments
- ✅ Add your Render URL to `ALLOWED_ORIGINS`

### Custom Infrastructure
- ✅ Support for any custom domain
- ✅ Environment variable configuration

## 📝 Adding New Domains

### Method 1: Environment Variables (Recommended)
```bash
# In your deployment platform's environment settings
ALLOWED_ORIGINS=https://new-domain.com,https://another-domain.com
```

### Method 2: Code Update
Add new domains to the `allowedOrigins` array in `backend/app.js`:
```javascript
const allowedOrigins = [
  // ... existing origins
  'https://your-new-domain.com',
  'https://staging.yourdomain.com'
];
```

## 🔍 Testing CORS

### Development Testing
```bash
# Check if your frontend can connect to backend
curl -H "Origin: http://localhost:4200" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend-url.com/api/test
```

### Production Testing
```bash
# Test with your production domain
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://your-backend-url.com/health
```

## ⚠️ Common Issues & Solutions

### Issue: CORS Error in Production
**Solution**: Add your frontend domain to `ALLOWED_ORIGINS` environment variable

### Issue: Preview Deployments Not Working
**Solution**: Current configuration auto-allows Vercel/Netlify/Azure preview URLs

### Issue: API Requests Failing
**Solution**: Check that `credentials: true` is set in your frontend HTTP client

### Issue: Custom Domain Not Working
**Solution**: Add to `allowedOrigins` array or `ALLOWED_ORIGINS` environment variable

## 🎯 Current Status

✅ **Development**: Fully configured  
✅ **Vercel**: Ready for deployment  
✅ **Azure**: Ready for deployment  
✅ **Netlify**: Ready for deployment  
✅ **Custom Domains**: Environment variable support  
✅ **Preview Deployments**: Automatic support  
✅ **Security**: Proper validation and logging  

## 🚀 Next Steps

1. **Deploy to your preferred platform**
2. **Add your actual production domains to `ALLOWED_ORIGINS`**
3. **Test all API endpoints from your frontend**
4. **Monitor logs for any blocked requests**
5. **Update domains as needed using environment variables**

Your CORS configuration is now bulletproof and ready for any deployment scenario! 🎉
