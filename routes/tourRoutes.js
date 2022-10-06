import express from "express";
import * as tourController from "./../controllers/tourController.js";
const router = express.Router();

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

export default router;
