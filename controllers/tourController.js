import Tour from "./../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
// import AppError from "../utils/AppError.js";
// import APIFeatures from "../utils/apiFeatures.js";

export const getAllTours = factory.getAll(Tour);
export const createTour = factory.createOne(Tour);
export const getTour = factory.getOne(Tour);
export const deleteTour = factory.deleteOne(Tour);
export const updateTour = factory.updateOne(Tour);

/*** aliase middleware ***/
export const aliasTopTours = catchAsync(async (req, res, next) => {
  req.query.sort = "-ratingsAverage,price";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
});

export const getStats = catchAsync(async (req, res, next) => {
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
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
