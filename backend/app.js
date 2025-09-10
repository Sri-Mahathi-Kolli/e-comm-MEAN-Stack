const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payment");
const adminOrderRoutes = require("./routes/admin-orders");
const reviewRoutes = require("./routes/review");
const recentlyViewedRoutes = require("./routes/recently-viewed");
const { verifyToken, isAdmin } = require("./db/middleware/auth-middleware");

const app = express();

// CORS for production - comprehensive origin allowlist
const allowedOrigins = [
  // Local development
  'http://localhost:4200',
  'http://localhost:4201',
  'http://localhost:4202',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3000',
  
  // Vercel deployments
  'https://e-comm-mean-stack.vercel.app',
  'https://saarvi.vercel.app',
  'https://e-comm-store.vercel.app',
  
  // Azure Static Web Apps
  'https://calm-beach-03b22131e.azurestaticapps.net',
  'https://witty-coast-00933a01e.azurestaticapps.net',
  
  // Azure App Service  
  'https://nodejs-backend-1.azurewebsites.net',
  
  // Netlify (if used)
  'https://e-comm-mean-stack.netlify.app',
  'https://saarvi.netlify.app',
  'https://e-comm-store.netlify.app',
  
  // GitHub Pages (if used)
  'https://rakesh-sundari.github.io',
  'https://rakesh-sundari.github.io/e-comm-Mean-Stack',
  'https://rakesh-sundari.github.io/e-comm-store',
  
  // Render deployments (backend hosting)
  'https://e-comm-backend.onrender.com',
  'https://e-comm-mean-stack.onrender.com',
  'https://saarvi-backend.onrender.com',
  
  // Custom domains (add your own)
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

// Add environment variable origins if specified
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any localhost for development (flexible port numbers)
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments (dynamic URLs)
    if (origin && (origin.includes('.vercel.app') || origin.includes('-vercel.app'))) {
      return callback(null, true);
    }
    
    // Allow Azure Static Web Apps (dynamic URLs)
    if (origin && origin.includes('.azurestaticapps.net')) {
      return callback(null, true);
    }
    
    // Allow Netlify deployments (dynamic URLs)
    if (origin && (origin.includes('.netlify.app') || origin.includes('.netlify.com'))) {
      return callback(null, true);
    }
    
    // Allow GitHub Pages deployments
    if (origin && origin.includes('.github.io')) {
      return callback(null, true);
    }
    
    // Allow Render deployments
    if (origin && origin.includes('.onrender.com')) {
      return callback(null, true);
    }
    
    // Allow Railway deployments
    if (origin && origin.includes('.railway.app')) {
      return callback(null, true);
    }
    
    // Check explicitly allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('⚠️ CORS origin check:', origin);
// Enable CORS for Vercel frontend
app.use(cors({
  origin: 'https://saarvi.vercel.app',
  credentials: true
}));
      // In production, you might want to be more restrictive
      // For now, allowing all to prevent deployment issues
      return callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Server running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/orders", verifyToken, isAdmin, orderRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/customer", verifyToken, customerRoutes);
app.use("/profile", verifyToken, profileRoutes);
app.use("/payment", verifyToken, paymentRoutes);
app.use("/admin-orders", verifyToken, isAdmin, adminOrderRoutes);
app.use("/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/reviews", reviewRoutes);
app.use("/api/recently-viewed", verifyToken, recentlyViewedRoutes);

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// MongoDB connection
async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "e-comm-store-db",
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Start server after DB connects
const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
