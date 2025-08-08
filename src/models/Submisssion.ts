import { SubmissionSchema } from "@/types/SchemaTypes";
import mongoose, { Schema, Model } from "mongoose";

const submissionSchema = new Schema<SubmissionSchema>({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forms",
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        required: true,
      },
      answer: { type: String, required: true },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});


export const submissionModel =  mongoose.models.submissions || mongoose.model<SubmissionSchema>("submissions", submissionSchema)
