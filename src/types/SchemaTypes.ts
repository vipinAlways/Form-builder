import mongoose, { Document, Types } from "mongoose";
export interface UserSchema extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  forms: Types.ObjectId | FormSchema[];
}
export interface CategorizeOption {
  text: string;
  belongsTo: string;
}

export interface FormSchema extends Document {
  title: string;
  headerImage: string;
  questions: Types.ObjectId | QuestionsSchema[];
  user: Types.ObjectId | UserSchema;
  theme: {
    bg: string;
    color: string;
  };
}

export interface QuestionsSchema extends Document {
  type: string;
  questionText: string;
  imageUrl: string;
  categorizeOptions?: CategorizeOption[];
  blanks: string[];
  paraGraph: string[];
  subQuestions: [
    {
      questionText: string;
      options: string[];
      correctAnswer: string;
    }
  ];
  options: string[];
  form: Types.ObjectId | FormSchema;
}

export interface SubmissionSchema extends mongoose.Document {
  form: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId | null;
  answers: [
    {
      question: Types.ObjectId; // ID of the question
      answer: string;
    }
  ];
  submittedAt: Date;
}
