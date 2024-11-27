import mongoose from 'mongoose';
import 'dotenv/config';

let MONGO_URI = process.env.MONGO_URI;

export default async function connectDB() {
  console.log('Connecting...');
  if (!MONGO_URI) {
    throw new Error('check the mongodb url');
  }
  let connection;
  try {
    connection = await mongoose.connect(MONGO_URI);
    console.log('Conected to Database !');
  } catch {
    (err: any) => {
      console.log('Failed to conecte to  Database');
      console.error(err);
      process.exit(1);
    };
  }
  return connection;
}