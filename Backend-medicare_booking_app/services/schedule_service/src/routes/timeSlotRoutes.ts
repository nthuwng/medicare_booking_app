import express, { Express } from "express";
import {
  createTimeSlotController,
  getAllTimeSlotsController,
} from "src/controller/timeSlotController";
import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

const timeSlotRoutes = (app: Express) => {
  router.post("/", createTimeSlotController);

  router.get("/", getAllTimeSlotsController);

  app.use("/time-slots", authenticateToken, authorizeAdmin, router);
};
export default timeSlotRoutes;
