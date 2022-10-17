import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import checkBody from "../middlewares/checkBody.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:resetToken").patch(authController.resetPassword);

// all the following will be protecting
router.use(authController.protect);

router.route("/updateMe").patch(authController.updateMe);
router.route("/updateMyPassword").patch(authController.updateMyPassword);
router.route("/deleteMe").delete(authController.deleteMe);
router.route("/me").get(authController.getMe);

// all the following will be restricting to admins only
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(checkBody, userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(
    checkBody,
    userController.removePasswordFieldsReq,
    userController.updateUser
  );

export default router;
