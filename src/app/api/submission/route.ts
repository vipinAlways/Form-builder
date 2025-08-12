"use server";
import { NextRequest, NextResponse } from "next/server";
import { FormModel } from "@/models/Form";
import { SubmitssionModel } from "@/models/Submisssion";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { QuestionsClient, StudentAnswer } from "@/types/ApiTypes";


export async function POST(req: NextRequest) {
  await db();
  try {
    const { formId, answers }: { formId: string; answers: StudentAnswer[] } =
      await req.json();
    const session = await getServerSession(authOptions);

    if (!formId) throw new Error("No form ID provided");

    const user = await UserModel.findOne({ email: session?.user?.email });
    if (!user)
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 400 }
      );

    const studentId = user._id;
    const form = await FormModel.findById(formId)
      .populate("questions")
      .populate("submission")
      .exec();
    if (!form)
      return NextResponse.json({ error: "Form not found" }, { status: 404 });

    let score = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const question: QuestionsClient = form.questions.find(
        (q: { _id: string }) => q._id === ans.questionId
      );
      let isCorrect = false;

      if (question) {
        if (ans.type === "comprehension") {
          isCorrect =
            question?.paraGraph?.subQuestions?.some(
              (sq) => sq.correctAnswer === ans.answer.answer
            ) || false;
        } else if (ans.type === "categorize") {
          isCorrect =
            JSON.stringify(question.categorizeOptions?.asnwer) ===
            JSON.stringify(ans.answer);
        } else if (ans.type === "cloze") {
          isCorrect =
            question.blanks?.answer?.some((b) => b.text === ans.answer.text) ||
            false;
        }
      }

      if (isCorrect) score += 1;
      return { ...ans, isCorrect };
    });

    const submission = await SubmitssionModel.create({
      formId,
      studentId,
      answers: evaluatedAnswers,
      score,
    });

    await FormModel.findByIdAndUpdate(formId, {
      $push: { submission: submission._id },
    });
    await UserModel.findByIdAndUpdate(
      studentId,
      {
        $push: { submittedForms: formId },
      },
      { new: true }
    );
    return NextResponse.json({ success: true, submission });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
