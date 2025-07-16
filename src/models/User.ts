import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  provider: String;
  profilePicture: String;
  name: String;
}
const userSchema = new Schema<IUser>(
  {
    provider: String,
    profilePicture: String,
    name: String,
  },
  { discriminatorKey: "provider", timestamps: true, collection: "users" }
);

const User = mongoose.model<IUser>("User", userSchema);

interface IGoogleUser extends IUser {
  googleId: String;
  email: String;
  gAccessToken: String;
  gRefreshToken: String;
}
const GoogleUserSchema = new Schema<IGoogleUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  gAccessToken: String,
  gRefreshToken: String,
});
const GoogleUser = User.discriminator<IGoogleUser>("google", GoogleUserSchema);

export interface ILocalUser extends IUser {
  email: String;
  password: String;
}
const LocalUserSchema = new Schema<ILocalUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const LocalUser = User.discriminator<ILocalUser>("local", LocalUserSchema);

export { User, GoogleUser, LocalUser };
/**
 * const userSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide your email!"],
    },
    provider: String,
    profilePicture: String,
    gAccessToken: String,
    gRefreshToken: String,
    name: String,
  },
  { timestamps: true }
);

 */
