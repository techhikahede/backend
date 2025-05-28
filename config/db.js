import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB Connected...');
    }
    catch(err) {
        console.error("error occured at", err);
    }
}

export default connectDB