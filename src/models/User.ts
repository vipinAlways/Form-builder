import { UserSchema } from "@/types/SchemaTypes";
import mongoose, { Schema, Model } from "mongoose";

const userSchema = new Schema<UserSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  forms: [{ type: Schema.Types.ObjectId, ref: "forms" }],
});

export const UserModel =  mongoose.models.UserSchema || mongoose.model<UserSchema>("users", userSchema);
