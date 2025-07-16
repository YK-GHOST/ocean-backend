import mongoose, { Schema } from "mongoose";

const logSchema = new Schema({
  workflowId: { type: Schema.Types.ObjectId, ref: "Workflow" },
  status: { type: String, enum: ["success", "error", "pending"] },
  triggerPayload: Schema.Types.Mixed,
  actionResults: Schema.Types.Mixed,
  error: Schema.Types.Mixed,
  startedAt: Date,
  endedAt: Date,
});

export const ExecutionLog = mongoose.model("ExecutionLog", logSchema);
