/**
 * One-time helper to provision employee / admin accounts for testing.
 * Usage: node scripts/seedStaff.js
 *
 * Citizen self-registration uses POST /api/auth/register.
 * Superadmin monitoring is owned by Backend Member 2.
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const STAFF = [
  {
    name: "Ward Employee",
    email: "employee@wardtech.local",
    password: "Employee@123",
    role: "employee",
  },
  {
    name: "Ward Admin",
    email: "admin@wardtech.local",
    password: "Admin@1234",
    role: "admin",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const staff of STAFF) {
      const existing = await User.findOne({ email: staff.email });
      if (existing) {
        console.log(`Skip (exists): ${staff.email} [${staff.role}]`);
        continue;
      }
      await User.create(staff);
      console.log(`Created: ${staff.email} [${staff.role}]`);
    }

    console.log("Done.");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
