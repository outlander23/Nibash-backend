import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const DECRYPT_MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const DECRYPT_MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_STR = process.env.MONGODB_STR;

const MONGODB_URI = MONGODB_STR.replace(
  "<password>",
  DECRYPT_MONGODB_PASSWORD
).replace("<username>", DECRYPT_MONGODB_USERNAME);

const connectToMongoDB = () => {
  return mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to the database"))
    .catch((error) => {
      console.log("Failed to connect database");
      console.log(error);
      process.exit(1);
    });
};
export default connectToMongoDB;
