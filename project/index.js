const express = require("express");
require("dotenv").config();
const db = require("./config/mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", require("./routes/router"));

const port = process.env.PORT || 8060;

app.listen(port, () => {
  console.log(`server is up and running on port: ${port}`);
});
