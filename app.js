import express from "express";
import morgan from "morgan";
import tourRoutes from "./routes/tourRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use("/api/v1/tours", tourRoutes);

export default app;
