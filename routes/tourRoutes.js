import express from "express";
import * as tourController from "./../controllers/tourController.js";
import * as authController from "../controllers/authController.js";
import checkBody from "../middlewares/checkBody.js";
const router = express.Router();

router
  .route("/top-cheap-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/stats").get(tourController.getStats);
router.route("/plan").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(checkBody, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    tourController.deleteTour
  )
  .patch(checkBody, tourController.updateTour);

export default router;
