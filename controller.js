import { Room, ExtraCost } from "./models.js";

// Controller function to update room meal
const updateRoomMeal = async (req, res) => {
  console.log("Update");

  try {
    const { roomNumber, currentDate, state } = req.body;

    // Validate input parameters
    if (
      !roomNumber ||
      typeof currentDate !== "number" ||
      typeof state !== "number"
    ) {
      return res.status(400).send("Invalid input parameters.");
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).send("Room not found.");
    }

    console.log(roomNumber, currentDate, state);

    room.mealsAccordingDate[currentDate] = state;
    await room.save();

    return res.status(200).send("Meal updated successfully.");
  } catch (error) {
    console.error("Error updating meal:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller function to add amount
const addAmount = async (req, res) => {
  try {
    const { roomNumber, date, amount } = req.body;

    // Validate input parameters
    if (!roomNumber || !date || typeof amount !== "number") {
      return res.status(400).send("Invalid input parameters.");
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).send("Room not found.");
    }

    room.payTaka.push({ date, amount });
    await room.save();

    return res.status(200).send("Amount added successfully.");
  } catch (error) {
    console.error("Error adding amount:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller function to retrieve room details
const roomDetails = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    // Validate input parameters
    if (!roomNumber) {
      return res.status(400).send("Invalid input parameters.");
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).send("Room not found.");
    }

    // Calculate total payment
    let totalPay = 0;
    console.log(room.payTaka);
    for (const taka of room.payTaka) {
      totalPay += taka.amount * 1;
      console.log(taka.amount);
    }
    room.totalAmount = totalPay;
    // Send room details with totalPay as part of the response
    return res.status(200).json({ room, totalPay });
  } catch (error) {
    console.error("Error retrieving room details:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller function to update the room owner name
const updateRoomOwnerName = async (req, res) => {
  try {
    const { roomNumber, newOwnerName } = req.body;

    // Validate input parameters
    if (!roomNumber || !newOwnerName) {
      return res.status(400).send("Invalid input parameters.");
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).send("Room not found.");
    }

    // Update the roomOwnerName
    room.roomOwnerName = newOwnerName;

    // Save the updated room
    await room.save();

    return res.status(200).send("Room owner name updated successfully.");
  } catch (error) {
    console.error("Error updating room owner name:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Function to generate today's meals
const genTodayMeal = async (req, res) => {
  try {
    // Get today's date
    const currentDate = new Date();
    const currentDay = currentDate.getDate() * 1;

    // Iterate through each room
    const rooms = await Room.find();
    const todaysMeals = [];

    let fullmeal = 0;
    let halfmeal = 0;

    for (const room of rooms) {
      if (room.mealsAccordingDate[currentDay] === -1) {
        room.mealsAccordingDate[currentDay] =
          room.mealsAccordingDate[currentDay - 1];
      }

      if (room.mealsAccordingDate[currentDay] >= 1)
        fullmeal += room.mealsAccordingDate[currentDay];
      if (room.mealsAccordingDate[currentDate] == 0.5) halfmeal++;

      await room.save();

      todaysMeals.push({
        roomNumber: room.roomNumber,
        meals: room.mealsAccordingDate[currentDay],
      });
    }

    console.log("Today's meals generated successfully.");

    // Send the list of today's meals as part of the response
    return res
      .status(200)
      .json({ currentDay, todaysMeals, fullmeal, halfmeal });
  } catch (error) {
    console.error("Error generating today's meals:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const initMeal = async (req, res) => {
  try {
    const rooms = [];

    // Loop for rooms 101 to 129
    for (let roomNumber = 101; roomNumber <= 129; roomNumber++) {
      rooms.push({
        roomNumber: roomNumber,
        roomOwnerName: "Owner",
        mealsAccordingDate: new Array(32).fill(-1),
        payTaka: [],
        totalAmount: 0,
      });
    }

    // Loop for rooms 201 to 229
    for (let roomNumber = 201; roomNumber <= 229; roomNumber++) {
      rooms.push({
        roomNumber: roomNumber,
        roomOwnerName: "Owner",
        mealsAccordingDate: new Array(32).fill(-1),
        payTaka: [],
        totalAmount: 0,
      });
    }

    // Bulk insert rooms
    await Room.insertMany(rooms, { timeout: 300000 }); // Increase timeout to 30 seconds

    console.log("Rooms initialized successfully.");
    res.send("ok init");
  } catch (error) {
    console.error("Error initializing rooms:", error);
  }
};

// Function to calculate total cost for a room
const tillCostRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    let totalCost = 0.0;
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      console.log("Room not found.");
      return res.status(404).send("Room not found.");
    }

    // Logic to calculate total cost for a room
    for (const meal of room.mealsAccordingDate) {
      if (meal >= 1) {
        totalCost += 65; // Full meal cost
      } else if (meal == 0.5) {
        totalCost += 40; // Half meal cost
      }
    }

    // Add extra costs
    const extraCosts = await ExtraCost.find();
    for (const extraCost of extraCosts) {
      totalCost += extraCost.amount;
    }

    console.log("Total cost for room:", totalCost);

    // Send the total cost as part of the response
    return res.status(200).json({ totalCost });
  } catch (error) {
    console.error("Error calculating total cost:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getAllExtras = async (req, res) => {
  try {
    // Fetch all extra costs from the database
    const extras = await ExtraCost.find();

    // Send the list of extra costs as response
    return res.status(200).json(extras);
  } catch (error) {
    console.error("Error fetching extra costs:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Function to calculate total cost for all rooms and extras
const totalCost = async (req, res) => {
  try {
    let totalCost = 0.0;

    // Logic to calculate total cost for all rooms and extras
    const rooms = await Room.find();
    for (const room of rooms) {
      totalCost += await calculateRoomCost(room.roomNumber);
    }

    // Add extra costs
    const extraCosts = await ExtraCost.find();
    for (const extraCost of extraCosts) {
      totalCost += extraCost.amount;
    }

    // Send the total cost as part of the response
    return res.status(200).json({ totalCost });
  } catch (error) {
    console.error("Error calculating total cost:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Function to calculate total cost for a room
const calculateRoomCost = async (roomNumber) => {
  try {
    let totalCost = 0.0;
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      console.log("Room not found.");
      return totalCost;
    }

    // Logic to calculate total cost for a room
    for (const meal of room.mealsAccordingDate) {
      if (meal >= 1) {
        totalCost += 65; // Full meal cost
      } else if (meal === 0.5) {
        totalCost += 40; // Half meal cost
      }
    }

    console.log("Total cost for room:", totalCost);

    return totalCost;
  } catch (error) {
    console.error("Error calculating total cost for room:", error);
    return 0.0; // Return 0 in case of error
  }
};

const remain = async () => {
  try {
    // Logic to calculate remaining amount
    const totalGivenAmount = await totalCost();
    const totalReceivedAmount = await calculateTotalReceivedAmount(); // Implement this function to calculate total received amount
    const remainingAmount = totalReceivedAmount - totalGivenAmount;

    return remainingAmount;
  } catch (error) {
    console.error("Error calculating remaining amount:", error);
    return 0.0; // Return 0 in case of error
  }
};

const generateTable = async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.find();

    // Initialize an empty array to store room details with total payment
    const roomDetailsWithTotalPayment = [];

    // Iterate through each room
    for (const room of rooms) {
      // Calculate total payment for the room

      let fullmeal = 0;
      let halfmeal = 0;

      let totalPayment = 0;

      for (const taka of room.payTaka) {
        totalPayment += taka.amount;
      }

      for (const meal of room.mealsAccordingDate) {
        if (meal >= 1) fullmeal += meal;
        if (meal == 0.5) halfmeal++;
      }

      // Create an object containing room details and total payment
      const roomDetail = {
        roomNumber: room.roomNumber,
        roomOwnerName: room.roomOwnerName,
        totalPayment: totalPayment,
        fullmeal: fullmeal,
        halfmeal,
        roommeal: room.mealsAccordingDate,
      };

      // Add the room detail to the array
      roomDetailsWithTotalPayment.push(roomDetail);
    }

    // Send the array of room details with total payment as response
    return res.status(200).json(roomDetailsWithTotalPayment);
  } catch (error) {
    console.error("Error generating table:", error);
    return res.status(500).send("Internal Server Error");
  }
};
// Controller function to create an extra cost
const createExtraCost = async (req, res) => {
  try {
    // Extract data from the request body
    const { description, amount } = req.body;

    // Validate input parameters
    if (!description || !amount || typeof amount !== "number") {
      return res.status(400).send("Invalid input parameters.");
    }

    // Create a new ExtraCost instance
    const newExtraCost = new ExtraCost({
      description,
      amount,
      date: new Date(), // Automatically set the current date
    });

    // Save the new extra cost to the database
    await newExtraCost.save();

    return res.status(201).send("Extra cost created successfully.");
  } catch (error) {
    console.error("Error creating extra cost:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export {
  remain,
  initMeal,
  addAmount,
  roomDetails,
  genTodayMeal,
  tillCostRoom,
  getAllExtras,
  generateTable,
  updateRoomMeal,
  createExtraCost,
  updateRoomOwnerName,
};
