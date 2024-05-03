import { Room } from "./models.js";

// Controller function to update meals

const updateRoomMeal = async (roomNumber, currentDate, state) => {
  try {
    // Validate input parameters
    if (
      !roomNumber ||
      typeof currentDate !== "number" ||
      typeof state !== "number"
    ) {
      console.log("Invalid input parameters.");
      return;
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      console.log("Room not found.");
      return;
    }
    room.mealsAccordingDate[currentDate] = state;
    await room.save();
    console.log("Meal updated successfully.");
  } catch (error) {
    console.error("Error updating meal:", error);
  }
};

// Controller function to add amount
const addAmount = async (roomNumber, date, amount) => {
  try {
    // Validate input parameters
    if (!roomNumber || !date || typeof amount !== "number") {
      console.log("Invalid input parameters.");
      return;
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      console.log("Room not found.");
      return;
    }
    room.payTaka.push({ date, amount });
    await room.save();
    console.log("Amount added successfully.");
  } catch (error) {
    console.error("Error adding amount:", error);
  }
};

// Function to update the room owner name
const updateRoomOwnerName = async (roomNumber, newOwnerName) => {
  try {
    // Validate input parameters
    if (!roomNumber || !newOwnerName) {
      console.log("Invalid input parameters.");
      return;
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      console.log("Room not found.");
      return;
    }

    // Update the roomOwnerName
    room.roomOwnerName = newOwnerName;

    // Save the updated room
    await room.save();
    console.log("Room owner name updated successfully.");
  } catch (error) {
    console.error("Error updating room owner name:", error);
  }
};

const genTodayMeal = async () => {
  try {
    // Get today's date

    // Extract the day of the month as a number
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Iterate through each room
    const rooms = await Room.find();
    for (const room of rooms) {
      // Get the previous date
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);

      // If mealsAccordingDate for the previous date is not updated, skip
      if (room.mealsAccordingDate[previousDate.getDate()] === -1) {
        continue;
      }

      // Calculate total meal for today
      let totalMeal = 0;
      for (const meal of room.mealsAccordingDate) {
        if (meal === 1) {
          totalMeal += 1; // Full meal
        } else if (meal === 0.5) {
          totalMeal += 0.5; // Half meal
        }
      }

      // Update mealsAccordingDate for today
      room.mealsAccordingDate[currentDay] = totalMeal;

      // Save the updated room
      await room.save();
    }

    console.log("Today's meals generated successfully.");
  } catch (error) {
    console.error("Error generating today's meals:", error);
  }
};

const initMeal = async () => {
  try {
    for (let roomNumber = 101; roomNumber <= 129; roomNumber++) {
      const room = new Room({
        roomNumber: roomNumber,
        roomOwnerName: "Owner", // Set default owner name
        mealsAccordingDate: new Array(32).fill(-1), // Initialize mealsAccordingDate array as one base indexing
        payTaka: [], // Initialize payTaka array
        totalAmount: 0, // Initialize totalAmount
      });
      await room.save();
    }

    for (let roomNumber = 201; roomNumber <= 229; roomNumber++) {
      const room = new Room({
        roomNumber: roomNumber,
        roomOwnerName: "Owner", // Set default owner name
        mealsAccordingDate: new Array(32).fill(-1), // Initialize mealsAccordingDate array s one base indexing
        payTaka: [], // Initialize payTaka array
        totalAmount: 0, // Initialize totalAmount
      });
      await room.save();
    }

    console.log("Rooms initialized successfully.");
  } catch (error) {
    console.error("Error initializing rooms:", error);
  }
};
initMeal();
export { updateRoomMeal, addAmount, updateRoomOwnerName };
