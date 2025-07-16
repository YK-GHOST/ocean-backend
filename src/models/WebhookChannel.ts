import mongoose, { Schema } from "mongoose";
import { SUPPORTED_APPS } from "../const";

const channelSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  integration: { type: String, enum: SUPPORTED_APPS },
  channelId: String,
  resourceId: String,
  expiration: Date,
  startPageToken: String,
});

export const WebhookChannel = mongoose.model("WebhookChannel", channelSchema);
