import { UserSchema } from "@/types/SchemaTypes";
import mongoose, { Schema, Model } from "mongoose";

const userSchema:Schema<UserSchema> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image:{type:String},
  forms: [{ type: Schema.Types.ObjectId, ref: "forms" }],
});

export const UserModel =  mongoose.models.users || mongoose.model<UserSchema>("users", userSchema);
