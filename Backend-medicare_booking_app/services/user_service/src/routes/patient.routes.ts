import express, { Express } from "express";
import {
  createPatientController,
  getPatientByIdController,
  getAllPatientController,
} from "../controllers/patient.controller";
import { authenticateToken } from "src/middleware/auth.middleware";

const router = express.Router();

const patientRoutes = (app: Express) => {
  router.post("/", authenticateToken,createPatientController);
  router.get("/:id", getPatientByIdController);
  router.get("/", getAllPatientController);
  

  app.use("/patients", router);
};

export default patientRoutes;
