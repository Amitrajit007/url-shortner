import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with the data base --- from the config file ");
  } catch (e) {
    console.log("Error found while connecting with the DB : " + e.message || e);
  }
};

export default connectDb;
