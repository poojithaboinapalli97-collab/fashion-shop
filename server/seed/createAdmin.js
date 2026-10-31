const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('[Error] ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file');
      process.exit(1);
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase().trim() });

    if (existingAdmin) {
      console.log(`[Seed] User with email ${adminEmail} already exists. Updating role to 'admin'...`);
      existingAdmin.role = 'admin';
      existingAdmin.password = adminPassword; // Triggers pre-save hash hook
      await existingAdmin.save();
      console.log(`[Seed] Successfully updated admin account: ${existingAdmin.email}`);
    } else {
      const admin = await User.create({
        name: 'Administrator',
        email: adminEmail.toLowerCase().trim(),
        password: adminPassword,
        role: 'admin',
      });
      console.log(`[Seed] Successfully created admin account: ${admin.email}`);
    }

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to create admin: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
