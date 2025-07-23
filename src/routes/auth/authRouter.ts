import express from "express";
import passport from "passport";
import { AuthController } from "../../controllers/AuthController";
import { AuthRequest } from "../../interfaces/authRequest.interface";
const router = express.Router();

const authController = new AuthController();

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

export default router;
