import express, { Express } from "express";
import { createAppointmentController } from "src/controller/appointment.controllers";
import {
  authenticateToken,
  authorizePatient,
} from "src/middleware/auth.middleware";

const router = express.Router();

const appointmentRoutes = (app: Express) => {
  router.post(
    "/create-appointment",
    authorizePatient,
    createAppointmentController
  );

  app.use("/", authenticateToken, router);
};

export default appointmentRoutes;
