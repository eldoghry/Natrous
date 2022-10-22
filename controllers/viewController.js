import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/AppError.js";
// import * as factory from "./handlerFactory.js";
import path from "path";
import Tour from "./../models/tourModel.js";

export const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render(path.join(process.cwd(), "views", "index.pug"), {
    title: "All tours",
    tours,
  });
});
