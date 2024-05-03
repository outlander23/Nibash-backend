import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mealRouter from "./router.js"; // Assuming mealRouter is defined in a separate file

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Set origin to '*' to allow requests from any origin
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Mount the mealRouter
app.use("/meals", mealRouter);
app.get("/", (req, res) => {
  res.send("This is a temporary route.");
});

export default app;
