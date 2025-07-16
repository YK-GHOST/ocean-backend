import express from "express";
import authRouter from "./authRouter/authRouter";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
