import mongoose, { Schema } from "mongoose";
import { SUPPORTED_APPS } from "../const";

const connectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, //id-1
    integration: {
      type: Schema.Types.ObjectId,
      ref: "Integration",
      required: true,
    }, //google slack
    accessToken: { type: String, required: true },
    refreshToken: String,
    expiresAt: Date,
    metadata: Schema.Types.Mixed,
    encrypted: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Connection = mongoose.model("Connection", connectionSchema);
