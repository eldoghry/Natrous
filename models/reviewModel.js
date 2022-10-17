import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import Tour from "./tourModel.js";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, "A Review is required"],
    },

    rating: {
      type: Number,
      min: [1, "Review rating must be between [1,5]"],
      max: [5, "Review rating must be between [1,5]"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// TODO: prevent duplicated review for same tour

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.methods.isUserOwnReview = function (userId) {
  return this.user.id === userId.toString();
};

// Create Static method run on model
reviewSchema.statics.calcAvgRating = async function (tourId) {
  console.log("🚩 recalculate rating average");

  // Idea: aggregate all reviews that have same tour id
  //this point to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 }, //calc rating num
        avgRating: { $avg: "$rating" }, //calc rating avg
      },
    },
    {
      $project: {
        nRating: 1,
        avgRating: {
          $round: ["$avgRating", 1], //rounding avgRating 2.333333 2.4
        },
      },
    },
  ]);

  //update tour rating
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.9,
    });
};

// calc rating avg after saving review
reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.tour);
});

export default mongoose.model("Review", reviewSchema);
