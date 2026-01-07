import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    if (!uri) throw new Error("No URL");

    await mongoose.connect(uri, {
      family: 4,
    });

    console.log("db connected`");
  } catch (error) {
    console.error("MongoDB not connected:", error);
    process.exit(1);
  }
};

export default connectDB;
