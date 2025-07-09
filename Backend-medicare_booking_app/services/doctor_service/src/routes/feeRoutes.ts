import express, { Express } from "express";
import {
  createFeeController,
  getFeeController,
} from "src/controller/feeController";

import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

router.post(
  "/:doctorProfileId/fee",
  authenticateToken,
  authorizeAdmin,
  createFeeController
);
router.get(
  "/:doctorProfileId/fee",
  authenticateToken,
  authorizeAdmin,
  getFeeController
);

export default router;
