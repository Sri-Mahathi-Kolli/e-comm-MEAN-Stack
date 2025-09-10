const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../db/user');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/e-comm-store-db');
  const passwordHash = await bcrypt.hash('rakesh', 10);
  const user = new User({
    firstName: 'Rakesh',
    lastName: 'Sundari',
    email: 'raki@gmail.com',
    password: passwordHash,
    isAdmin: true
  });
  await user.save();
  console.log('Admin user created:', user.email);
  mongoose.disconnect();
}

createAdmin();
