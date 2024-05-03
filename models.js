import mongoose from "mongoose";

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
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

// Define the schema for the ExtraCost
const extraCostSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ExtraCost = mongoose.model("ExtraCost", extraCostSchema);

export { Room, ExtraCost };
