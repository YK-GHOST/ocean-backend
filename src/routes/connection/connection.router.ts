import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../interfaces/authRequest.interface";
import { ConnectionController } from "../../controllers/ConnectionController";

const router = express.Router();

const connectionController = new ConnectionController();

const asyncMiddleware =
  (middleware: any) => (req: any, res: Response, next: NextFunction) =>
    Promise.resolve(middleware(req, res, next)).catch(next);

router.get("/:app/connect", asyncMiddleware(authMiddleware), (req, res, next) =>
  connectionController.connect(req as AuthRequest, res, next)
);

router.get("/:app/callback", (req, res, next) =>
  connectionController.callback(req as AuthRequest, res, next)
);

router.get(
  "/:app/status",
  asyncMiddleware(authMiddleware),
  (req, res, next) => {
    connectionController.status(req as AuthRequest, res, next);
  }
);

export default router;
