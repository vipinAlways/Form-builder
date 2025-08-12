"use server";
import db from "@/lib/db";
import { FormModel } from "@/models/Form";
import { UserModel } from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await db();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  try {
    const form = await FormModel.findById(id).populate("user");
    if (!form) throw new Error("No form found");

    await FormModel.deleteOne({
      _id: form._id,
    });

    await UserModel.findByIdAndUpdate(
      form.user,
      {
        $pull: { forms: id },
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Form has been deleted",
        ok: true,
      },
      { status: 200 }
    );
  } catch (error) {
    throw new Error("SERVER ERROR" +error)
  }
};
