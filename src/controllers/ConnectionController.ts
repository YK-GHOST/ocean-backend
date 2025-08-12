import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/authRequest.interface";
import {
  getIntegrationConfig,
  isValidIntegration,
} from "../utils/integration.utils";
import { SUPPORTED_APPS } from "../types/index.types";
import { GenericRepsone } from "../interfaces/misc.interface";
import passport from "passport";
import { Config } from "../config";
import { Integration } from "../models/Integration";
import { Connection } from "../models/Connection";

export class ConnectionController {
  async connect(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { app } = req.params;
      const appKey = app as keyof typeof SUPPORTED_APPS;
      const appName = SUPPORTED_APPS[appKey];

      if (!isValidIntegration(appName)) {
        res.status(400).json({
          success: false,
          error: `Integration '${app}' is not supported`,
        });
        return;
      }
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const state = Buffer.from(
        JSON.stringify({
          userId: userId,
          app: app,
        })
      ).toString("base64");

      const integrationConfig = getIntegrationConfig(appName);
      passport.authenticate(integrationConfig.strategy, {
        scope: integrationConfig.scope,
        state: state,
        access_type: "offline",
        prompt: "consent",
      } as any)(req, res, next);
    } catch (err) {
      console.error(`Error initiating ${req.params.app} connection:`, err);
      res.status(500).json({
        success: false,
        error: "Failed to initiate connection",
      } as GenericRepsone<string>);
    }
  }

  async callback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { app } = req.params;
      const appKey = app as keyof typeof SUPPORTED_APPS;
      const appName = SUPPORTED_APPS[appKey];

      if (!isValidIntegration(appName)) {
        res.status(400).json({
          success: false,
          error: `Integration '${app}' is not supported`,
        });
        return;
      }

      let userId: string | undefined;
      try {
        if (req.query.state) {
          const stateData = JSON.parse(
            Buffer.from(req.query.state as string, "base64").toString()
          );
          userId = stateData.userId;
        }
      } catch (e) {
        console.error("❌ Failed to parse state parameter:", e);
        next(e);
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          error: "Invalid state parameter - user ID not found",
        });
        return;
      }

      req.user = { id: userId } as any;

      const integrationConfig = getIntegrationConfig(appName);

      passport.authenticate(
        integrationConfig.strategy,
        (err: any, connection: any, info: any) => {
          if (err) {
            console.error(`Error in ${app} callback:`, err);
            return res.status(500).json({
              success: false,
              error: "Authentication failed",
              details: err.message,
            });
          }

          if (!connection) {
            console.error(`No connection created for ${app}:`, info);
            return res.status(400).json({
              success: false,
              error: "Failed to establish connection",
              details: info,
            });
          }

          const successUrl = `${Config.FRONTEND_URI}/integration-result?app=${app}&status=success`;
          res.redirect(successUrl);
        }
      )(req, res, next);
    } catch (err) {
      console.error("💥 Callback error:", err);
      res.status(500).json({
        success: false,
        error: "Callback failed",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
  async status(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { app } = req.params;
      const appKey = app as keyof typeof SUPPORTED_APPS;
      const appName = SUPPORTED_APPS[appKey];

      if (!isValidIntegration(appName)) {
        res.status(400).json({
          success: false,
          error: `Integration '${app}' is not supported`,
        });
        return;
      }
      const userId = req.user?._id;

      //getting integration
      const integration = await Integration.findOne({ name: appName });
      if (!integration) {
        res.status(400).json({
          success: false,
          error: `No integration found for the app ${app}`,
        });
        return;
      }
      const connection = await Connection.findOne({
        userId,
        integration: integration._id,
      });

      if (!connection) {
        res.status(400).json({
          success: false,
          error: `App ${app} has not been connected`,
        });
      }

      res.status(200).json({
        success: true,
        data: `App ${app} is connected`,
      });
    } catch (err) {
      console.error(`Error getting app satus for: ${req.params.app}`, err);
      next(err);
      return;
    }
  }
}
/**
 *  passport.authenticate(
        integrationConfig.strategy,
        (err: any, connection: any, info: any) => {
          console.log("📥 Passport authenticate callback triggered");
          console.log("❌ Error:", err);
          console.log(
            "🔗 Connection:",
            connection ? "Created/Updated" : "None"
          );
          console.log("ℹ️ Info:", info);

          if (err) {
            console.error(`Error in ${app} callback:`, err);
            return res.status(500).json({
              success: false,
              error: "Authentication failed",
              details: err.message,
            });
          }

          if (!connection) {
            console.error(`No connection created for ${app}:`, info);
            return res.status(400).json({
              success: false,
              error: "Failed to establish connection",
              details: info,
            });
          }

          // Success
          res.status(200).json({
            success: true,
            data: `${integrationConfig.displayName} has been connected successfully`,
          });
        }
      )(req, res, next);
 */
