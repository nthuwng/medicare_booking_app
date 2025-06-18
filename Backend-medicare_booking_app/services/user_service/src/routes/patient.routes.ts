import express, { Express } from "express";
import {
    createPatientController,
    getPatientByIdController,
    getAllPatientController
} from "../controllers/patient.controller";

const router = express.Router();

const patientRoutes = (app: Express) => {
  router.post("/", createPatientController);
  router.get("/:id", getPatientByIdController);
  router.get("/", getAllPatientController);
  

  app.use("/patients", router);
};

export default patientRoutes;
