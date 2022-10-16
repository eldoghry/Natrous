import express from "express";
import * as tourController from "./../controllers/tourController.js";
import * as authController from "../controllers/authController.js";
import checkBody from "../middlewares/checkBody.js";
import reviewRouter from "./reviewRoutes.js";
const router = express.Router();

// reviews nested route
// ex: GET /tour/123/reviews
router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-cheap-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/stats").get(tourController.getStats);

router
  .route("/plan")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.getMonthlyPlan
  );

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    checkBody,
    authController.protect,
    authController.restrictTo("admin"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  )
  .patch(
    checkBody,
    authController.protect,
    authController.restrictTo("admin"),
    tourController.updateTour
  );

export default router;
