import mongoose, { Schema } from "mongoose";
import { SUPPORTED_APPS } from "../const";

const connectionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, //id-1
  integration: { type: String, required: true, enum: SUPPORTED_APPS },
  accessToken: { type: String, required: true },
  refreshToken: String,
  expiresAt: Date,
  metadata: Schema.Types.Mixed,
  encrypted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Connection = mongoose.model("Connection", connectionSchema);
