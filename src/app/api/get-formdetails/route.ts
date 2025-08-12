"use server";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { questionModel } from "@/models/Questions";
import { FormData } from "@/app/create-form/action";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  await db();
  try {
  
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    console.log(id,"didiosjdijsoij");
    if (!id) {
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
    }

    

    const formDetails: FormData | null = await FormModel.findById(id);
    if (!formDetails) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log(formDetails, "ggggggg");

    const questions = await questionModel.find({
      _id: { $in: formDetails.questions },
      form: formDetails._id,
    });

    return NextResponse.json({ formDetails, questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server issue" }, { status: 500 });
  }
};
