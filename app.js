import express from "express";
import morgan from "morgan";
import tourRoutes from "./routes/tourRoutes.js";
import * as dotenv from "dotenv";
import addRequestTime from "./middlewares/addRequestTime.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(addRequestTime);
app.use("/api/v1/tours", tourRoutes);

// Unkown Routes
app.use("*", (req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `${req.originalUrl} is invalid url!`,
  });
});

export default app;
