import express from "express";
import {
  genTodayMeal,
  updateRoomMeal,
  initMeal,
  updateRoomOwnerName,
  addAmount,
  roomDetails,
  generateTable,
} from "./controller.js";

const mealRouter = express.Router();

// Endpoint to generate today's meals
mealRouter.post("/generate-today-meal", genTodayMeal);

// Endpoint to update room meal
mealRouter.post("/update-room-meal", updateRoomMeal);

// Endpoint to initialize meals for all rooms
mealRouter.post("/init-meal", initMeal);

// Endpoint to update room owner name
mealRouter.post("/update-room-owner", updateRoomOwnerName);

//
mealRouter.get("/room-details/:roomNumber", roomDetails);

mealRouter.get("/table", generateTable);

// Endpoint to add amount
mealRouter.post("/add-amount", addAmount);

export default mealRouter;
