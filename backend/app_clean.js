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
  
  // Azure Static Web Apps
  'https://calm-beach-03b22131e.azurestaticapps.net',
  'https://witty-coast-00933a01e.azurestaticapps.net',
  
  // Azure App Service  
  'https://nodejs-backend-1.azurewebsites.net',
  
  // Netlify (if used)
  'https://e-comm-mean-stack.netlify.app',
  'https://saarvi.netlify.app',
  
  // GitHub Pages (if used)
  'https://rakesh-sundari.github.io',
  
  // Custom domains (add your own)
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

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
    
    // Check explicitly allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('⚠️ CORS origin check:', origin);
      return callback(new Error('Not allowed by CORS'));
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
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Health check
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// Routes
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/orders", verifyToken, isAdmin, orderRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/customer", verifyToken, customerRoutes);
app.use("/profile", verifyToken, profileRoutes);
app.use("/payment", verifyToken, paymentRoutes);
app.use("/auth", authRoutes);
app.use("/api/contact", contactRoutes);

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
