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
  categorizeOptions: {
    items: {
      type: [String],
      require: true,
    },
    Belongs: { type: [String], require: true },
    asnwer: [
      {
        text: { type: String, required: true },
        belongs: { type: String, required: true },
      },
    ],
  },
  blanks: {
    option: {
      type: [String],
      require: true,
    },
    answer: [
      {
        position: { type: Number, require: true },
        text: { type: String, require: true },
      },
    ],
  },
  paraGraph: {
    para: {
      type: String,
      require: true,
    },
    subQuestions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
      },
    ],
  },

  options: [String],
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forms",
    require: true,
  },
});

export const questionModel: Model<QuestionsSchema> =
  mongoose.models.questions ||
  mongoose.model<QuestionsSchema>("questions", questionSchema);
