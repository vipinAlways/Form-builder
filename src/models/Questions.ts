import { QuestionsSchema } from "@/types/SchemaTypes";
import mongoose, { Model, Schema } from "mongoose";

const questionSchema = new Schema<QuestionsSchema>({
  type: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true,
  },
  questionText: { type: String, required: true },
  imageUrl: { type: String },
  categorizeOptions: [
    {
      text: { type: String, required: true },
      belongs: { type: String, required: true },
    },
  ],
  blanks: [String],
  paraGraph: [String],
  subQuestions: [
    {
      questionText: String, 
      options: [String],
      correctAnswer: String,
    },
  ],
  options: [String],
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forms",
    require: true,
  },
});

export const questionModel: Model<QuestionsSchema> =
  mongoose.models.QuestionsSchema ||
  mongoose.model<QuestionsSchema>("questions", questionSchema);
