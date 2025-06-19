import express, { Express } from "express";
import {
  createAdminController,
  getAdminByIdController,
  getAllAdmintController,
} from "../controllers/admin.controller";
import { authenticateToken } from "src/middleware/auth.middleware";

const router = express.Router();

const adminRoutes = (app: Express) => {
  router.post("/", authenticateToken, createAdminController);
  router.get("/:id", authenticateToken, getAdminByIdController);
  router.get("/", authenticateToken, getAllAdmintController);

  app.use("/admins", router);
};

export default adminRoutes;
