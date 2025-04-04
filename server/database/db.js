import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Mern_stack_sms"
    });
    console.log(`Database connected successfully: ${connection.connection.host}`);
  } catch (err) {
    console.log(`Error connecting to db: ${err.message}`);
    // Exit process with failure in case of critical db connection error
    process.exit(1);
  }
}