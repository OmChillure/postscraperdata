import mongoose from 'mongoose';

// Global mongoose connection reference
let cached = global.mongoose;

// Initialize cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas database
 */
export async function connectToDatabase() {
  // If we have an existing connection, use it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Get MongoDB URI from environment variable
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    });
  }

  // Wait for connection and store it
  cached.conn = await cached.promise;
  return cached.conn;
}