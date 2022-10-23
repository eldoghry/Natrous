import express from "express";
import * as viewController from "../controllers/viewController.js";

const router = express.Router();

router.get("/tour/:slug", viewController.getTour);
router.get("/", viewController.getOverview);

export default router;
