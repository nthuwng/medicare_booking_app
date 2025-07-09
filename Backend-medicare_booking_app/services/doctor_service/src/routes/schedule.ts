import express, { Express } from "express";
import {
  createScheduleController,
  getScheduleByDoctorIdController,
} from "src/controller/scheduleController";

import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

router.post(
  "/schedules",
  authenticateToken,
  authorizeAdmin,
  createScheduleController
);
router.get(
  "/schedules/:doctorId",
  authenticateToken,
  authorizeAdmin,
  getScheduleByDoctorIdController
);

export default router;
