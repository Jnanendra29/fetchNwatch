const mongoose = require("mongoose");

mongoose.connect(process.env.COMPASS_URI);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("error in mongoose connection: ", error);
});

db.once("open", () => {
  console.log("Successfully connected to database");
});

module.exports = db;
