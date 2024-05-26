const mongoose = require("mongoose");
const { title } = require("process");

const dbSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
  },
  sold: {
    type: Boolean,
  },
  dateOfSale: {
    type: String,
  },
});

const dbModel = mongoose.model("Sale", dbSchema);

module.exports = dbModel;
