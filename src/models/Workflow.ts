import mongoose, { Schema } from "mongoose";
import { SUPPORTED_APPS } from "../const";

const workflowSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  trigger: {
    app: {
      type: String,
      enum: SUPPORTED_APPS,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    config: Schema.Types.Mixed,
  },
  actions: [
    {
      app: {
        type: String,
        enum: SUPPORTED_APPS,
        required: true,
      },
      event: {
        type: String,
        required: true,
      },
      config: Schema.Types.Mixed,
    },
  ],
  active: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now },
});

export const Workflow = mongoose.model("Workflow", workflowSchema);
