import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/slotswapper';

    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit with failure
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error: any) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});