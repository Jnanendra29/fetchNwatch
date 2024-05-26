const express = require("express");
const {
  getDataFromApi,
  getAllSales,
  searchTransactions,
  staticticsPerMonth,
  barChartApi,
  getByCategory,
  combinedData
} = require("../controller/controller");

const router = express.Router();

router.get("/", getDataFromApi);
router.get("/getAllSales", getAllSales);
router.get("/search", searchTransactions);
router.get("/searchmonth/:key", staticticsPerMonth);
router.get("/barchart/:key", barChartApi);
router.get("/category/:key", getByCategory);
// router.get("/combined/:key", combinedData);

module.exports = router;
