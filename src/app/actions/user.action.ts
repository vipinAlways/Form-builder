"use server";

import db from "@/lib/db";
import { UserModel } from "@/models/User";
import { redirect } from "next/navigation";
import { UserSchema } from "@/types/SchemaTypes";

export const getUser = async ({ email }: { email: string }) => {
  await db();

  try {
    if (!email) redirect("/");

   
    const user  = await UserModel.findOne<UserSchema>({ email }).lean();

    if (!user) return null;

    return {
      user,
      message: "User found successfully",
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
