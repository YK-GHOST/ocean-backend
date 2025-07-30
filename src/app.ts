import express from "express";
import apiRouter from "./routes/index";
import "./config/passport";
import { Config } from "./config";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: Config.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

export default app;
