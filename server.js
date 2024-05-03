import * as dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import app from "./app.js";
import connectToMongoDB from "./mongodb.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectToMongoDB();

    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
