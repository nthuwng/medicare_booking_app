import { Request, Response } from "express";
import { createAdminProfile } from "../services/admin.service";

const createAdminController = async (req: Request, res: Response) => {
  try {
    const admin = await createAdminProfile(req.body);
    res.status(201).json({ success: true, data: admin });
  } catch (error: any) {
    console.error("Error creating admin:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createAdminController };
