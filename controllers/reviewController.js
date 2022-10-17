import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import * as factory from "./handlerFactory.js";
// import APIFeatures from "../utils/apiFeatures.js";

/*** MIDDLEWARE ***/
export const prepareBodyReq = (req, _, next) => {
  // we need user id and tour id to create review
  req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  next();
};

/*** HANDLER ***/
export const createReview = factory.createOne(Review);
export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);

//admin and authorized user can delete review
export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("review not exist", 400));
  }

  if (req.user.role !== "admin" && !review.isUserOwnReview(req.user._id))
    return next(new AppError("you are not authorized to do that", 403));

  await review.delete();

  res.status(204).send("deleted");
});
//admin and authorized user can update review
export const updateReview = catchAsync(async (req, res, next) => {
  const review =
    req.user.role === "admin"
      ? await Review.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
      : await Review.findOneAndUpdate(
          { _id: req.params.id, user: req.user._id },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

  if (!review) {
    return next(new AppError("review not exist", 400));
  }

  // if (req.user.role !== "admin" && !review.isUserOwnReview(req.user._id))
  //   return next(new AppError("you are not authorized to do that", 403));

  res.status(200).json({ status: "success", review });
});
