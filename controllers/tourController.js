import APIFeatures from "../utils/apiFeatures.js";
import Tour from "./../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    const apiFeatures = new APIFeatures(Tour.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const tours = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      requestTime: req.requestTime,
      tours,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).send("deleted");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const aliasTopTours = async (req, res, next) => {
  req.query.sort = "-ratingsAverage,price";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  // getAllTours(req, res);

  next();
};

export const getStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // { $match: { secretTour: { $ne: true }, ratingsAverage: { $gte: 4.8 } } },
      {
        $group: {
          // _id: {
          //   $toUpper: "$difficulty",
          // },

          _id: "$difficulty",

          toursNum: { $sum: 1 },
          minAvgRating: { $min: "$ratingsAverage" },
          maxAvgRating: { $max: "$ratingsAverage" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          tours: { $addToSet: "$name" },
          // tours: { $addToSet: { name: "$name", price: "$price" } },
        },
      },
      {
        $sort: {
          toursNum: -1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getMonthlyPlan = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // { $match: { secretTour: { $ne: true }, ratingsAverage: { $gte: 4.8 } } },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },

          tours: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
