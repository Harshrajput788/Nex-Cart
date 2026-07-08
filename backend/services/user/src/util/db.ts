import mongoose from "mongoose";

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("🟢 MongoDB already connected");
    return;
  }

  try {
    console.log("🟡 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB as string, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully",conn.connection.host);
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); 
  }
  
};