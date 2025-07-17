import mongoose, { Document, Schema } from "mongoose";
import {
  IGoogleUser,
  ILocalUser,
  IUser,
} from "../interfaces/schema/user.interface";

const userSchema = new Schema<IUser>(
  {
    provider: String,
    profilePicture: String,
    name: String,
  },
  { discriminatorKey: "provider", timestamps: true, collection: "users" }
);

const User = mongoose.model<IUser>("User", userSchema);

const GoogleUserSchema = new Schema<IGoogleUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  gAccessToken: String,
  gRefreshToken: String,
});

const GoogleUser = User.discriminator<IGoogleUser>("google", GoogleUserSchema);

const LocalUserSchema = new Schema<ILocalUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const LocalUser = User.discriminator<ILocalUser>("local", LocalUserSchema);

export { User, GoogleUser, LocalUser };
