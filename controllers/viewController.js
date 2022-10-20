// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/AppError.js";
// import * as factory from "./handlerFactory.js";
import path from "path";

export const getOverview = (req, res) => {
  res.status(200).render(path.join(process.cwd(), "views", "base.pug"), {
    title: "title string",
  });
};
