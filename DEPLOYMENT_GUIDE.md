# E-Commerce Deployment Guide

## Platform Configurations

### 1. Vercel (Frontend)

**Frontend Deployment:**
- Build Command: `npm run build`
- Output Directory: `dist/webapp`
- Node.js Version: 18.x

**Environment Variables:**
```
NODE_ENV=production
```

**Backend API URL in Angular:**
Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com/api'
};
```

### 2. Render (Backend)

**Backend Deployment:**
- Build Command: `npm install`
- Start Command: `node app.js`
- Node.js Version: 18.x

**Environment Variables (Required):**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://your-custom-domain.com
```

### 3. GitHub Pages (Alternative Frontend)

**GitHub Actions Workflow (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd webapp
        npm install
        
    - name: Build
      run: |
        cd webapp
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./webapp/dist/webapp
```

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Set up database user with read/write permissions
3. Configure network access (0.0.0.0/0 for deployment)
4. Get connection string and add to environment variables

### 5. Email Configuration (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Use App Password in EMAIL_PASS environment variable

### 6. Stripe Configuration

1. Get Stripe Secret Key from Stripe Dashboard
2. Add to backend environment variables
3. Configure webhook endpoints for production

## CORS Configuration

The backend is configured to automatically allow:
- All localhost variations (development)
- Vercel deployments (*.vercel.app)
- Render deployments (*.onrender.com)
- GitHub Pages (*.github.io)
- Netlify deployments (*.netlify.app)
- Azure deployments (*.azurestaticapps.net)

## Environment Setup Checklist

### Backend (Render)
- [ ] MongoDB connection string configured
- [ ] JWT secret set
- [ ] Email credentials configured
- [ ] Stripe keys configured
- [ ] CORS origins updated if using custom domain

### Frontend (Vercel)
- [ ] API URL updated in environment files
- [ ] Build configuration verified
- [ ] Custom domain configured (if applicable)

### Database (MongoDB Atlas)
- [ ] Cluster created and configured
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained

## Common Issues and Solutions

### CORS Errors
- Ensure frontend URL is in ALLOWED_ORIGINS
- Check that backend CORS configuration includes your domain
- Verify protocol (http vs https) matches

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Ensure build commands are correct

### Database Connection Issues
- Verify MongoDB connection string format
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

### Email Issues
- Use App Password, not regular Gmail password
- Verify 2FA is enabled on Gmail account
- Check email service configuration

## Performance Optimization

### Frontend
- Enable gzip compression in Vercel
- Configure proper caching headers
- Optimize images and assets

### Backend
- Configure database connection pooling
- Implement proper error handling
- Add request rate limiting if needed

## Security Considerations

- Never commit sensitive environment variables
- Use strong JWT secrets
- Regularly rotate API keys
- Implement proper input validation
- Configure HTTPS for all production deployments
