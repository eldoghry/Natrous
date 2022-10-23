import express from "express";
import * as viewsController from "../controllers/viewsController.js";

const router = express.Router();

router.get("/tour/:slug", viewsController.getTour);
router.get("/login", viewsController.login);
router.get("/", viewsController.getOverview);

export default router;
