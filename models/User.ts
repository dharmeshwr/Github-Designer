import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  githubId: string;
  login: string;
  name?: string | null;
  email?: string | null;
  encryptedToken: string;
  sessionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, index: true, unique: true },
    login: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    encryptedToken: { type: String, required: true },
    sessionId: { type: String, index: true, sparse: true },
  },
  { timestamps: true }
);

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
