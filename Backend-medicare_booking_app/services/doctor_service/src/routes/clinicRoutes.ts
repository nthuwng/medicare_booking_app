import express, { Express } from "express";
import {
  createClinicController,
  getClinicsController,
  deleteClinicController,
  updateClinicController
} from "src/controllers/clinicController";

import {
  authenticateToken,
  authorizeAdmin,
  
} from "src/middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticateToken, authorizeAdmin, createClinicController);

router.get("/", authenticateToken, getClinicsController);
router.delete("/:id", authenticateToken, authorizeAdmin , deleteClinicController  );
router.put("/:id", authenticateToken, authorizeAdmin , updateClinicController  );


export default router;
