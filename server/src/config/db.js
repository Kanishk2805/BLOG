import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    // A single shared DB connection for the whole API process.
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
