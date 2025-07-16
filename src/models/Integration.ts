import mongoose, { Schema } from "mongoose";
import { SUPPORTED_APPS } from "../const";

const integrationSchema = new Schema({
  name: { type: String, required: true, enum: SUPPORTED_APPS },
  authType: { type: String, enum: ["oauth2"], required: true },
  scopes: [String],
});

export const Integration = mongoose.model("Integration", integrationSchema);
