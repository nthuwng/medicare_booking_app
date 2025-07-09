import express, { Express } from "express";
import { createClinicController } from "src/controller/clinicController";

import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticateToken, authorizeAdmin, createClinicController);

export default router;
