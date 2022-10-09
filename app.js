import express from "express";
import morgan from "morgan";
import tourRoutes from "./routes/tourRoutes.js";
import * as dotenv from "dotenv";
import addRequestTime from "./middlewares/addRequestTime.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/AppError.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(addRequestTime);
app.use("/api/v1/tours", tourRoutes);

// HANDLING UNKOWEN ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} is invalid url!!`, 404));
});

//HANDLING EXPRESS APP ERROR RESPONSE
app.use(globalErrorHandler);

export default app;
