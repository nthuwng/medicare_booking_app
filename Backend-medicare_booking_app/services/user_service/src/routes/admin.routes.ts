import express, { Express } from "express";
import {
  createAdminController,
  getAdminByIdController,
  getAllAdmintController,
} from "../controllers/admin.controller";
import {
  authenticateToken,
  authorizeAdmin,
} from "src/middleware/auth.middleware";

const router = express.Router();

const adminRoutes = (app: Express) => {
  router.post("/", authenticateToken, authorizeAdmin, createAdminController);
  router.get("/:id", authenticateToken,authorizeAdmin, getAdminByIdController);
  router.get("/", authenticateToken, authorizeAdmin, getAllAdmintController);

  app.use("/admins", router);
};

export default adminRoutes;
