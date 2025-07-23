import { CookieOptions, NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/authRequest.interface";
import jwt from "jsonwebtoken";
import { Config } from "../config";
import { GenericRepsone } from "../interfaces/misc.interface";

export class AuthController {
  private async signJWT(userId: string) {
    if (!Config.JWT_SECRET || !Config.JWT_EXPIRES_IN)
      throw new Error("No valid configuration variables found.");
    const token = jwt.sign({ userId }, Config.JWT_SECRET as jwt.Secret, {
      expiresIn: Config.JWT_EXPIRES_IN,
    });
    return token;
  }

  private async createSendToken(
    userId: string,
    statusCode: number,
    res: Response
  ) {
    try {
      const token = await this.signJWT(userId);
      const cookieOptions: CookieOptions = {
        expires: new Date(
          Date.now() + Config.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === "prod") cookieOptions.secure = true;

      const responseObject: GenericRepsone<string> = {
        status: "success",
        data: {
          token,
          userId,
        },
      };

      res.cookie("jwtToken", token, cookieOptions);
      res.status(200).json(responseObject);
    } catch (err) {
      console.error("Failed to create and send token: ", err);
    }
  }

  async loginGoogle(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user._id) {
      res
        .status(400)
        .json({ success: "false", error: "User not authenticated." });
      return;
    }
    try {
      const userId = req.user._id;
      await this.createSendToken(userId, 200, res);
    } catch (err) {
      console.error("Error logging google: ", err);
    }
  }
}
