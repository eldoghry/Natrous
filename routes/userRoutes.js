import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import checkBody from "../middlewares/checkBody.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(checkBody, userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(checkBody, userController.updateUser);

export default router;
