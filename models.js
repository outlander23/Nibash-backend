const mongoose = require("mongoose");

// Define the schema for the room
const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  roomOwnerName: {
    type: String,
    required: true,
  },
  mealsAccordingDate: [
    {
      // float number
      type: Number,
      required: true,
    },
  ],
  payTaka: [
    {
      date: {
        type: Number,
        required: true,
      },
      givenTime: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0, // Default value is 0
  },
});

// Define a virtual property to count the number of one meals
roomSchema.virtual("numberOfOneMeals").get(function () {
  return this.mealsAccordingDate.filter((meal) => meal === 1).length;
});

// Define a virtual property to count the number of greater than one meals
roomSchema.virtual("numberOfGreaterThanOneMeals").get(function () {
  return this.mealsAccordingDate.filter((meal) => meal > 1).length;
});

// Create the Room model using the schema
const Room = mongoose.model("Room", roomSchema);

module.exports = { Room };
