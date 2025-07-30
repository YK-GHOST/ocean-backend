import express from "express";
import authRouter from "./auth/authRouter";
import connectionRouter from "./connection/connection.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/connection", connectionRouter);

export default router;
