import express from "express";
import * as tourController from "./../controllers/tourController.js";
import checkBody from "../middlewares/checkBody.js";
import { protect, authorize } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/top-cheap-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/stats").get(tourController.getStats);
router.route("/plan").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(protect, tourController.getAllTours)
  .post(checkBody, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .delete(protect, authorize(["admin"]), tourController.deleteTour)
  .patch(checkBody, tourController.updateTour);

export default router;
