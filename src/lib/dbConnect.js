import mongoose from "mongoose";

const connection = {};

const dbConnect = async () => {
    if (connection.isConnected) {
        console.log("Already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
};

export default dbConnect;
