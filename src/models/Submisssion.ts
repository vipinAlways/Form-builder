import mongoose, { Schema, Document } from "mongoose";

export interface StudentAnswer {
  questionId: string;
  type: string;
  answer: any;
  isCorrect: boolean;
}

export interface StudentSubmission extends Document {
  formId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  answers: StudentAnswer[];
  score: number;
  submittedAt: Date;
}

const StudentAnswerSchema = new Schema<StudentAnswer>(
  {
    questionId: { type: String, required: true },
    type: { type: String, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const StudentSubmissionSchema = new Schema<StudentSubmission>({
  formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User" },
  answers: { type: [StudentAnswerSchema], required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const SubmitssionModel =
  mongoose.models.submissions ||
  mongoose.model<StudentSubmission>("submissions", StudentSubmissionSchema);
