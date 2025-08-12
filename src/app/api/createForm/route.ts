"use server";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { questionModel } from "@/models/Questions";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const { title, headerImage, theme, questions } = body;

    const user = await UserModel.findOne({
      email: session?.user?.email,
    });
    if (!title) {
      return NextResponse.json({ message: "Title  required" }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json(
        { message: "not authenticated" },
        { status: 400 }
      );
    }

    const newForm = await FormModel.create({
      title,
      headerImage: headerImage || "",
      theme: {
        bg: theme?.bg || "#ffffff",
        color: theme?.color || "#000000",
      },
      questions: [],
      user,
    });

    if (Array.isArray(questions) && questions.length > 0) {
      const createdQuestions = await questionModel.insertMany(
        questions.map((q) => ({
          ...q,
          form: newForm._id,
        }))
      );

      newForm.questions = createdQuestions.map((q) => q._id);
      await newForm.save();
    }

    await UserModel.findByIdAndUpdate(user._id, {
      $push: { forms: newForm._id },
    });

    return NextResponse.json(
      { message: "Form created successfully", form: newForm },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating form with questions:", error);
    return NextResponse.json(
      { message: "Error creating form with questions" },
      { status: 500 }
    );
  }
}
