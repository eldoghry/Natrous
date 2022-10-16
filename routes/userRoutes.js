import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import checkBody from "../middlewares/checkBody.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:resetToken").patch(authController.resetPassword);

router
  .route("/updateMe")
  .patch(authController.protect, authController.updateMe);

router
  .route("/deleteMe")
  .delete(authController.protect, authController.deleteMe);

router.route("/me").get(authController.protect, authController.getMe);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    checkBody,
    userController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    checkBody,
    userController.updateUser
  );

export default router;
