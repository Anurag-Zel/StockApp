import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    dbName: "Matching_Order", // MongoDB database name
  })
    .then(() => console.log("Matching_Order solution database connected."))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
};