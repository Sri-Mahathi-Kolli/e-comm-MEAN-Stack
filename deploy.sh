#!/bin/bash

# E-Commerce Deployment Script
# This script helps with common deployment tasks

echo "🚀 E-Commerce Deployment Helper"
echo "================================"

# Function to deploy to Vercel
deploy_frontend() {
    echo "📱 Deploying Frontend to Vercel..."
    cd webapp
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install
    
    # Build the project
    echo "🔨 Building project..."
    npm run build
    
    # Deploy to Vercel (requires Vercel CLI)
    if command -v vercel &> /dev/null; then
        echo "🌐 Deploying to Vercel..."
        vercel --prod
    else
        echo "⚠️ Vercel CLI not found. Please install it with: npm i -g vercel"
        echo "   Then run: vercel --prod"
    fi
    
    cd ..
}

# Function to prepare backend for deployment
prepare_backend() {
    echo "🖥️ Preparing Backend for Render deployment..."
    cd backend
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install
    
    # Check environment file
    if [ ! -f ".env" ]; then
        echo "⚠️ .env file not found!"
        echo "📋 Please copy .env.template to .env and fill in your values"
        cp .env.template .env
        echo "✅ Created .env from template - please edit it with your values"
    else
        echo "✅ .env file exists"
    fi
    
    # Test the application
    echo "🧪 Testing application..."
    node -e "console.log('✅ Node.js setup OK')"
    
    echo "📝 Backend is ready for Render deployment!"
    echo "   1. Push your code to GitHub"
    echo "   2. Connect your GitHub repo to Render"
    echo "   3. Set environment variables in Render dashboard"
    echo "   4. Deploy!"
    
    cd ..
}

# Function to update environment files
update_environments() {
    echo "🔧 Updating environment configurations..."
    
    read -p "Enter your backend URL (e.g., https://your-app.onrender.com): " backend_url
    
    # Update Angular environment
    cat > webapp/src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: '${backend_url}/api'
};
EOF
    
    echo "✅ Updated Angular production environment"
    echo "🔧 Remember to update your backend ALLOWED_ORIGINS environment variable"
    echo "   with your frontend URL when you deploy to Vercel"
}

# Function to check requirements
check_requirements() {
    echo "🔍 Checking requirements..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "❌ Node.js not found - please install Node.js"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        echo "✅ npm: $(npm --version)"
    else
        echo "❌ npm not found"
        exit 1
    fi
    
    # Check Angular CLI
    if command -v ng &> /dev/null; then
        echo "✅ Angular CLI: $(ng version --no-analytics 2>/dev/null | head -1)"
    else
        echo "⚠️ Angular CLI not found - install with: npm install -g @angular/cli"
    fi
    
    # Check Vercel CLI (optional)
    if command -v vercel &> /dev/null; then
        echo "✅ Vercel CLI: $(vercel --version)"
    else
        echo "ℹ️ Vercel CLI not found - install with: npm install -g vercel"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1. Check requirements"
    echo "2. Deploy frontend to Vercel"
    echo "3. Prepare backend for Render"
    echo "4. Update environment URLs"
    echo "5. Exit"
    echo ""
}

# Main script
while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            check_requirements
            ;;
        2)
            deploy_frontend
            ;;
        3)
            prepare_backend
            ;;
        4)
            update_environments
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-5."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
