import express, { Express } from "express";
import {
  createScheduleController,
  getAllScheduleController,
  getScheduleByDoctorIdController,
} from "src/controller/scheduleController";
import {
  authenticateToken,
  authorizeAdmin,
  authorizeDoctor,
} from "src/middleware/auth.middleware";

const router = express.Router();

const scheduleRoutes = (app: Express) => {
  router.post(
    "/",
    authenticateToken,
    authorizeDoctor,
    createScheduleController
  );
  router.get("/", authenticateToken, authorizeAdmin, getAllScheduleController);

  router.get(
    "/:doctorId",
    authenticateToken,
    authorizeDoctor,
    getScheduleByDoctorIdController
  );

  app.use("/schedules", router);
};

export default scheduleRoutes;
