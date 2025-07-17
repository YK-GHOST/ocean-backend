import express from "express";
import authRouter from "./auth/authRouter";

const router = express.Router();

router.use("/auth", authRouter);
// router.use("/integration",integrationRouter);

export default router;
