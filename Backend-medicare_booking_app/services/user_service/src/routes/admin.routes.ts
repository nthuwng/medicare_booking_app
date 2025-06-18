import express, { Express } from "express";
import {
  createAdminController,
  getAdminByIdController,
  getAllAdmintController
} from "../controllers/admin.controller";

const router = express.Router();

const adminRoutes = (app: Express) => {
  router.post("/", createAdminController);
  router.get("/:id", getAdminByIdController);
  router.get("/", getAllAdmintController);

  

  app.use("/admins", router);
};

export default adminRoutes;
