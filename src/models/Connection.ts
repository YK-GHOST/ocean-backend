import mongoose, { Schema } from "mongoose";

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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

connectionSchema.index({ userId: 1, integration: 1 }, { unique: true }); //Only one connection per integration per user

export const Connection = mongoose.model("Connection", connectionSchema);
