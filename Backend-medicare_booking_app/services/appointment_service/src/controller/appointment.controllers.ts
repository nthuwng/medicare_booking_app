import { Request, Response } from "express";
import { createAppointmentService } from "src/services/appointment.services";

const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || "";
    const appointment = await createAppointmentService(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Tạo thông tin appointment thành công.",
      data: appointment,
    });
  } catch (error: any) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export { createAppointmentController };
