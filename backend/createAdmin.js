const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

// REPLACE THIS WITH YOUR CONNECTION STRING
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:password123@cluster0.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to DB');

    // 1. Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@agrotechharvest.com' });
    if (adminExists) {
      console.log('⚠️ Admin already exists');
      process.exit();
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // 3. Create Admin User
    const user = new User({
      name: 'Admin User',
      email: 'admin@agrotechharvest.com',
      password: hashedPassword,
      isAdmin: true // <--- THIS IS THE KEY
    });

    await user.save();
    console.log('🎉 Admin User Created! Login with: admin@agrotechharvest.com / admin123');
    process.exit();
  })
  .catch((err) => console.error(err));