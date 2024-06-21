import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // void - any type of data can be recieved
  if (connection.isConnected) {
    console.log("Already Connected to database!!");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "Connection failed"
    );

    // console.log("db::", db);

    connection.isConnected = db.connections[0].readyState;
    // console.log("Db.connections::", db.connections);
    console.log("DB Connected Successfully!!");
  } catch (err) {
    console.log("Database Connection failed!!", err);
    process.exit(1);
  }
}

export default dbConnect;
