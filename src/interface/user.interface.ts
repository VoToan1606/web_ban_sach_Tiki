import mongoose from "mongoose";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: any;
  permissions: mongoose.Schema.Types.ObjectId[];
}
