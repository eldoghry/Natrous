import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";
import checkBody from "../middlewares/checkBody.js";
const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(checkBody, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(checkBody, reviewController.updateReview);

export default router;
