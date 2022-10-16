import APIFeatures from "../utils/apiFeatures.js";
import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    requestTime: req.requestTime,
    reviews,
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  // we need user id and tour id to create review
  const review = await Review.create(req.body);
  res.status(201).json({ status: "success", review });
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("review not exist", 400));
  }

  res.status(200).json({ status: "success", review });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError("review not exist", 400));
  }
  res.status(204).send("deleted");
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("review not exist", 400));
  }

  res.status(200).json({ status: "success", review });
});
