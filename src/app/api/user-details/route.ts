"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  await db();
  const session = await getServerSession(authOptions);
  try {
    const user = await UserModel.findOne({
      email: session?.user?.email,
    });

    if (!user) throw new Error("Not authenticated");

    const Myforms = await FormModel.find({
      _id: { $in: user.forms },
      user: user._id,
    });
    const SubmittedForms = await FormModel.find({
      _id: { $in: user.submittedForms },
      user: user._id,
    });

    if (!Myforms || !SubmittedForms) {
      return NextResponse.json(
        { message: "Not Able to find" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      createdForms: Myforms,
      SubmittedForms,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server issue" }, { status: 500 });
  }
};
