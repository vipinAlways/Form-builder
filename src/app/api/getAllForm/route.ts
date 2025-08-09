"use server";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { UserModel } from "@/models/User";
import { FormSchema } from "@/types/SchemaTypes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  await db();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "User is unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "Unable to find user" }, { status: 404 });
    }

    const forms = await FormModel.find({ user: user._id });

    if (forms.length === 0) {
      return NextResponse.json({ message: "No forms found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        forms,
        message: "Forms fetched successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server issue" }, { status: 500 });
  }
};
