import express, { Express } from "express";
import { createSpecialtiesController } from "src/controller/specialtiesController";
import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createSpecialtiesController
);

export default router;
