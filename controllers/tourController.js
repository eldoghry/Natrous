import Tour from "./../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
import AppError from "../utils/AppError.js";
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

// /tours-within/:distance/center/:latlng/unite/:unit
// /tours-within/230/center/70.2,95.3/unite/km
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  if (!distance || !latlng || !unit)
    return next(
      new AppError(
        "PLease make sure request follow /tours-within/:distance/center/:latlng/unite/:unit",
        400
      )
    );

  const [lat, lng] = latlng.split(",");

  const radius = unit === "km" ? distance / 6378.1 : distance / 3963.2;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng * 1, lat * 1], radius] },
    },
  });

  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    result: tours.length,
    tours,
  });
});

// /tours/distance/:latlng/unit/:unit
export const getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;

  if (!latlng || !unit)
    return next(
      new AppError(
        "PLease make sure request follow /tours/distance/:latlng/unit/:unit",
        400
      )
    );

  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        distanceField: "distance",
        distanceMultiplier: multiplier,
        // spherical: true,
      },
    },
    {
      $project: { name: 1, distance: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    result: tours.length,
    tours,
  });
});

// implement distatnce geospatial tours
