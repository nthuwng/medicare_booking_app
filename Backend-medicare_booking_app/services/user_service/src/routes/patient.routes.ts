import express, { Express } from "express";
import {
  createPatientController,
  getPatientByIdController,
  getAllPatientController,
  deletePatientController,
  getPatientByUserIdController,
  updatePatientProfileController,
  deletePatientAvatarController
} from "../controllers/patient.controller";
import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

const patientRoutes = (app: Express) => {
  router.post("/", authenticateToken, createPatientController);
  router.get("/:id", authenticateToken, getPatientByIdController);
  router.get(
    "/by-user-id/:userId",
    authenticateToken,
    getPatientByUserIdController
  );
  router.get("/", authenticateToken, authorizeAdmin, getAllPatientController);
  router.delete(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    deletePatientController
  );
  router.put(
    "/update-profile/:id",
    authenticateToken,
    updatePatientProfileController
  );
  router.delete(
    "/delete-avatar/:id",
    authenticateToken,
    deletePatientAvatarController
  );

  app.use("/patients", router);
};

export default patientRoutes;
