import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/AppError.js";
// import * as factory from "./handlerFactory.js";
import path from "path";
import Tour from "../models/tourModel.js";

export const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render(path.join(process.cwd(), "views", "index.pug"), {
    title: "All tours",
    tours,
  });
});

export const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
  });

  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render(path.join(process.cwd(), "views", "tour.pug"), {
      title: tour.name,
      tour,
    });
});

export const login = (req, res) => {
  res.status(200).render(path.join(process.cwd(), "views", "login.pug"), {
    title: "Login",
  });
};
