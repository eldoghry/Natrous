import APIFeatures from "../utils/apiFeatures.js";
import Tour from "./../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllTours = catchAsync(async (req, res, next) => {
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
});

export const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({ status: "success", tour });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("Tour not exist", 400));
  }

  res.status(200).json({ status: "success", tour });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError("Tour not exist", 400));
  }
  res.status(204).send("deleted");
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("Tour not exist", 400));
  }

  res.status(200).json({ status: "success", tour });
});

//aliase middleware
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
