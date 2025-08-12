import express, { NextFunction, Response } from "express";
import passport from "passport";
import { AuthController } from "../../controllers/AuthController";
import { AuthRequest } from "../../interfaces/authRequest.interface";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = express.Router();

const authController = new AuthController();

const asyncMiddleware =
  (middleware: any) => (req: any, res: express.Response, next: NextFunction) =>
    Promise.resolve(middleware(req, res, next)).catch(next);

router.get(
  "/google",
  passport.authenticate("google-login", {
    scope: ["profile", "email"],
    access_type: "offline",
    prompt: "consent",
  } as any)
);
router.get(
  "/google/callback",
  passport.authenticate("google-login", {
    failureRedirect: "/auth/failure",
  }),
  (req, res, next) => authController.loginGoogle(req as AuthRequest, res, next)
);

router.get("/self", asyncMiddleware(authMiddleware), (req, res, next) => {
  authController.getSelf(req as AuthRequest, res, next);
});

export default router;
