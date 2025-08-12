"use server";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { questionModel } from "@/models/Questions";
import { FormData } from "@/app/create-form/action";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export const GET = async (req: Request) => {
  await db();
  try {
    const session = await getServerSession(authOptions);
    const user = await UserModel.findOne({ email: session?.user?.email });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
    }
    const isSubmitted = user.submittedForms.some(
      (subid : mongoose.Types.ObjectId | string) => subid.toString() === id.toString()
    );

    const formDetails: FormData | null = await FormModel.findById(id);
    if (!formDetails) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const questions = await questionModel.find({
      _id: { $in: formDetails.questions },
      form: formDetails._id,
    });

    return NextResponse.json({ formDetails, questions, isSubmitted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server issue" }, { status: 500 });
  }
};
