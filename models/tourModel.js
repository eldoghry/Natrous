import { query } from "express";
import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
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
      min: [1, "Tour rating must be between [1,5]"],
      max: [5, "Tour rating must be between [1,5]"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    startDates: [Date],

    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        enum: ["Point"], // Point, Polygon, Line ....
        default: "Point",
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        address: String,
        description: String,
        day: Number,
        type: {
          type: String,
          default: "Point",
        },
        coordinates: [Number],
      },
    ],

    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Model Middleware
tourSchema.pre("save", function (next) {
  //this is created doc
  //create auto slug for document in creation
  this.slug = slugify(this.name, { lower: true });

  next();
});

//Query Middleware
// assume that secret tours not supposed to displayed in list result
tourSchema.pre("find", function (next) {
  //this here is query
  // do query as I want
  this.find({ secretTour: { $ne: true } });

  next();
});

//populate tours
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    // match: { age: { $gte: 21 } },
    select: "name _id",
  });

  next();
});

//Query Middleware
// assume that secret tours not supposed to displayed in list result
tourSchema.pre("aggregate", function (next) {
  //this here is query
  // do query as I want
  // this.find({ secretTour: { $ne: true } });

  next();
});

// create virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

export default mongoose.model("Tour", tourSchema);
