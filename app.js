import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import addRequestTime from "./middlewares/addRequestTime.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/AppError.js";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import tourRoutes from "./routes/tourRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

/**** GENERAL MIDDLEWAERS ****/

//Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// EXPRESS BODY PARSER
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//LIMIT EXPRESS RATE FROM SINGLE IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter);

//prevent MongoDB Operator Injection.
app.use(mongoSanitize());

//sanitize user input coming from POST body, GET queries, and url params to prevent Cross Site Scripting (XSS) attack.
// ex: name: <h1>attacker</h1>
app.use(xss());

//Prevent paramater pollution ex: sort=price & sort=createdAt (price will be ignored)
app.use(
  hpp({
    //stop hpp for this fields
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//TEST MIDDLEWARE
app.use(addRequestTime);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// HANDLING UNKOWEN ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} is invalid url!!`, 404));
});
//
//HANDLING EXPRESS APP ERROR RESPONSE
app.use(globalErrorHandler);

export default app;
