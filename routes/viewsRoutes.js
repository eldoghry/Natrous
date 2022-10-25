import express from "express";
import { isLoggedIn } from "../controllers/authController.js";
import * as viewsController from "../controllers/viewsController.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/tour/:slug", viewsController.getTour);
router.get("/login", viewsController.login);
router.get("/logout", viewsController.logout);
router.get("/me", viewsController.getProfile);

export default router;
