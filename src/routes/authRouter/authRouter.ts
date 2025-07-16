import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google-login", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  } as any)
);
router.get(
  "/google/callback",
  passport.authenticate("google-login", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/profile");
  }
);

export default router;
