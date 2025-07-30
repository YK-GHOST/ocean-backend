import mongoose, { Schema } from "mongoose";

const integrationSchema = new Schema(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Integration = mongoose.model("Integration", integrationSchema);
