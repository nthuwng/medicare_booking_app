import { Request, Response } from "express";

const testController = (req: Request, res: Response) => {
  res.send("Websocket_services 9000 is running ");
};
export default testController;
