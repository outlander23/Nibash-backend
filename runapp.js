import * as readline from "readline";
import {
  remain,
  initMeal,
  addAmount,
  genTodayMeal,
  tillCostRoom,
  updateRoomMeal,
  updateRoomOwnerName,
} from "./controller.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const performAction = async () => {
  console.log("Choose an action:");
  console.log("1. Calculate remaining amount");
  console.log("2. Initialize meals");
  console.log("3. Add amount");
  console.log("4. Generate today's meals");
  console.log("5. Calculate total cost for a room");
  console.log("6. Update room meal");
  console.log("7. Update room owner name");
  console.log("8. Exit");

  rl.question("Enter your choice: ", async (choice) => {
    switch (choice) {
      case "1":
        console.log("Remaining amount:", await remain());
        break;
      case "2":
        await initMeal();
        console.log("Meals initialized successfully.");
        break;
      case "3":
        rl.question("Enter room number: ", async (roomNumber) => {
          rl.question("Enter date: ", async (date) => {
            rl.question("Enter amount: ", async (amount) => {
              await addAmount(roomNumber, date, amount);
              console.log("Amount added successfully.");
              performAction(); // Continue performing actions recursively
            });
          });
        });
        break;
      case "4":
        await genTodayMeal();
        console.log("Today's meals generated successfully.");
        break;
      case "5":
        rl.question("Enter room number: ", async (roomNumber) => {
          console.log("Total cost:", await tillCostRoom(roomNumber));
          performAction(); // Continue performing actions recursively
        });
        break;
      case "6":
        rl.question("Enter room number: ", async (roomNumber) => {
          rl.question("Enter current date: ", async (currentDate) => {
            rl.question("Enter state: ", async (state) => {
              await updateRoomMeal(roomNumber, currentDate, state);
              console.log("Meal updated successfully.");
              performAction(); // Continue performing actions recursively
            });
          });
        });
        break;
      case "7":
        rl.question("Enter room number: ", async (roomNumber) => {
          rl.question("Enter new owner name: ", async (newOwnerName) => {
            await updateRoomOwnerName(roomNumber, newOwnerName);
            console.log("Room owner name updated successfully.");
            performAction(); // Continue performing actions recursively
          });
        });
        break;
      case "8":
        console.log("Exiting...");
        rl.close();
        process.exit(0);
      default:
        console.log("Invalid choice.");
    }
  });
};

// Start the interactive session
performAction();
