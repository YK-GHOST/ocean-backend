export interface IUser extends Document {
  _id: string;
  provider: string;
  profilePicture: string;
  name: string;
}

export interface IGoogleUser extends IUser {
  googleId: string;
  email: string;
  gAccessToken: string;
  gRefreshToken: string;
}

export interface ILocalUser extends IUser {
  email: string;
  password: string;
}
