// lib/mongodb.js
import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectMongoDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    throw new Error("MongoDB connection failed");
  }
};
