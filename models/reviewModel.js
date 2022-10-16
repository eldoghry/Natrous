import mongoose from "mongoose";

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

export default mongoose.model("Review", reviewSchema);
