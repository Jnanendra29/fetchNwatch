const dbModel = require("../model/dbSchema");

// get data from an api and store the data in database
const getDataFromApi = async (req, res) => {
  try {
    let response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    response = await response.json();

    response.forEach((elem) => {
      const dateStr = elem.dateOfSale;
      const dateObj = new Date(dateStr);
      const month = dateObj.toLocaleString("default", { month: "long" });

      const new_Sale = new dbModel({
        ...elem,
        dateOfSale: month,
      });
      new_Sale
        .save()
        .then(() => {
          console.log("successfully stored in database");
        })
        .catch((error) => {
          console.log("error while storing data: ", error);
        });
    });

    res.status(200).json(response);
  } catch (error) {
    console.log("error in fetching data from the api: ", error);
  }
};

// get all data from database and pagination done
const getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const totalTransactions = await dbModel.countDocuments();
    const totalPages = Math.ceil(totalTransactions / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    const transactions = await dbModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: transactions,
      page,
      nextPage,
      totalPages,
      totalTransactions,
    });
  } catch (error) {
    console.log("error in getting data from database: ", error);
  }
};

// search transactions
const searchTransactions = async (req, res) => {
  const { dateOfSale, searchinput, page = 1 } = req.query;
  // console.log(dateOfSale);
  // console.log(searchinput);
  const query = {
    dateOfSale,
    $or: [
      { title: { $regex: searchinput, $options: "i" } },
      { description: { $regex: searchinput, $options: "i" } },
      { price: !isNaN(searchinput) ? Number(searchinput) : null },
    ],
  };

  if (isNaN(searchinput)) {
    query.$or.pop();
  }

  try {
    // Pagination parameters
    const options = {
      page: parseInt(page, 10),
      limit: 10,
      skip: (parseInt(page, 10) - 1) * 10,
    };
    let totalCount = await dbModel.countDocuments(query);
    let result = await dbModel
      .find(query)
      .limit(options.limit)
      .skip(options.skip);

    res
      .status(200)
      .json({
        result,
        totalCount,
        totalPages: Math.ceil(totalCount / options.limit),
        currentPage: options.page,
      });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

// get statictics
const staticticsPerMonth = async (req, res) => {
  //   console.log(req);
  try {
    let result = await dbModel.find({
      $or: [{ dateOfSale: { $regex: req.params.key } }],
    });

    let totalSale = 0;
    let soldItems = 0;
    let unsoldItems = 0;

    result.forEach((elem) => {
      if (elem.sold) {
        totalSale += elem.price;
        soldItems += 1;
      } else {
        unsoldItems += 1;
      }
    });

    res.status(200).json({
      TotalSales: totalSale,
      SoldItems: soldItems,
      UnsoldItems: unsoldItems,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};

// ranges of data by month
function getPriceRangePipeline(dateOfSale) {
  return [
    { $match: { dateOfSale } },
    {
      $bucket: {
        groupBy: "$price", // The field to group by
        boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901], // The boundaries for the buckets
        default: "901-above", // The label for the default bucket
        output: {
          sales: { $push: "$$ROOT" }, // Output each sales object into the corresponding bucket
        },
      },
    },
  ];
}

const barChartApi = async (req, res) => {
  console.log(req.params.key);
  const month = req.params.key;
  try {
    const pipeline = getPriceRangePipeline(month);
    const result = await dbModel.aggregate(pipeline).exec();

    const priceRanges = result.reduce((acc, item) => {
      acc[item._id] = item.sales;
      return acc;
    }, {});

    res.status(200).json(priceRanges);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

// counts of category per month
function getCategoryCountPipeline(month) {
  return [
    { $match: { dateOfSale: month } },
    {
      $group: {
        _id: "$category", // Group by category
        count: { $sum: 1 }, // Count the number of items in each category
      },
    },
  ];
}

const getByCategory = async (req, res) => {
  console.log(req.params.key);
  const month = req.params.key;
  try {
    const pipeline = getCategoryCountPipeline(month);
    const result = await dbModel.aggregate(pipeline).exec();

    const categoryCounts = result.map((item) => ({
      category: item._id,
      count: item.count,
    }));

    // console.log(categoryCounts);
    res.status(200).json({
      success: true,
      category: categoryCounts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//combined data
const combinedData = async (req, res) => {
  const { key } = req.params;
  const obj = {
    params: {
      key,
    },
  };
  console.log(key);
  try {
    const [totalTransactions, barChartData, categoryCounts] = await Promise.all(
      [staticticsPerMonth(obj), barChartApi(obj), getByCategory(obj)]
    );

    const combinedData = {
      totalTransactions,
      barChartData,
      categoryCounts,
    };
    res.status(200).json(combinedData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  getDataFromApi,
  getAllSales,
  searchTransactions,
  staticticsPerMonth,
  barChartApi,
  getByCategory,
  combinedData,
};
