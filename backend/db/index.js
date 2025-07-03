import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n BizDB connected !!! DB_HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("BizDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;