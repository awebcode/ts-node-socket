import mongoose from "mongoose";
const db = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URL!);
    console.log(`Mongodb Connected ${connection.host}`);
  } catch (error) {
      console.log(`Mongodb Not Connect`);
  }
};

export default db;
