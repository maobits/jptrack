import express from "express";
import {
  getOpenPositions,
  getClosedPositions,
  getClosedPositionsWithFilter,
} from "../controllers/positionsController.js";

const router = express.Router();

router.get("/open", getOpenPositions);
router.get("/closed", getClosedPositions);
router.get("/closed-with-filter", getClosedPositionsWithFilter);

export default router;
