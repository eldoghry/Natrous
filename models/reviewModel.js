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

    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Schema.ObjectId, ref: "Tour", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre("save", function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  this.populate({ path: "tour", select: "name" });
  next();
});

reviewSchema.methods.isUserOwnReview = function (userId) {
  return this.user.toString() === userId.toString();
};

export default mongoose.model("Review", reviewSchema);
