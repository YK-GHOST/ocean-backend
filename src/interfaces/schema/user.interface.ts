export interface IUser extends Document {
  provider: String;
  profilePicture: String;
  name: String;
}

export interface IGoogleUser extends IUser {
  googleId: String;
  email: String;
  gAccessToken: String;
  gRefreshToken: String;
}

export interface ILocalUser extends IUser {
  email: String;
  password: String;
}
