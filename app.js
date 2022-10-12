import express from "express";
import morgan from "morgan";
import tourRoutes from "./routes/tourRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import * as dotenv from "dotenv";
import addRequestTime from "./middlewares/addRequestTime.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/AppError.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

/**** GENERAL MIDDLEWAERS ****/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// EXPRESS BODY PARSER
app.use(express.json());

//LIMIT EXPRESS RATE FROM SINGLE IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter);

//TEST MIDDLEWARE
app.use(addRequestTime);

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

// HANDLING UNKOWEN ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} is invalid url!!`, 404));
});

//HANDLING EXPRESS APP ERROR RESPONSE
app.use(globalErrorHandler);

export default app;
