import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";
import checkBody from "../middlewares/checkBody.js";

const router = express.Router({
  //allow multipule paramater
  mergeParams: true,
});

//GET /tours/123123214sdffre/reviews
//POST /tours/123123214sdffre/reviews
//GET /tours/123123214sdffre/reviews/sfqwer23423141

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    checkBody,
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  )
  .patch(
    checkBody,
    authController.protect,
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  );

export default router;
