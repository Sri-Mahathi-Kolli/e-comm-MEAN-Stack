const mongoose = require('mongoose');
const User = require('./db/user');
require('dotenv').config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'e-comm-store-db' });
  const users = await User.find({});
  for (const user of users) {
    user.firstName = user.firstName || '';
    user.lastName = user.lastName || '';
    user.company = user.company || '';
    user.street = user.street || '';
    user.zip = user.zip || '';
    user.state = user.state || '';
    user.country = user.country || '';
    user.telephone = user.telephone || '';
    user.profileImage = user.profileImage || '';
    await user.save();
    console.log(`Updated user ${user.email}`);
  }
  console.log('Migration complete.');
  mongoose.disconnect();
}

migrate();
