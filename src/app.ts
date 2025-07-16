import express from "express";
import apiRouter from "./routes/index";
import "./config/passport";

import { Config } from "./config";
import session from "express-session";
import passport from "passport";

const app = express();

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
