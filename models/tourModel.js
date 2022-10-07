import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
    },

    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },

    discount: {
      type: Number,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },

    images: [String],

    ratingsAverage: {
      type: Number,
      default: 4.9,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    startDates: [Date],
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
