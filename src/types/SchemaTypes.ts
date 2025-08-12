import mongoose, { Document, Types } from "mongoose";
export interface UserSchema extends Document {
  name: string;
  email: string;
  image: string;
  forms: Types.ObjectId | FormSchema[];
  submittedForms: Types.ObjectId | FormSchema[];
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
  submission:Types.ObjectId
  theme: {
    bg: string;
    color: string;
  };
}

export interface QuestionsSchema extends Document {
  type: string;
  questionText: string;
  imageUrl: string;
  categorizeOptions?: {
    items: string[];
    Belongs: string[];
    asnwer: Array<{
      text: string;
      belongs: string;
    }>;
  };
  blanks?: {
    option: string[];
    answer: Array<{
      position: number;
      text: string;
    }>;
    blankQuestion:string;
    question:string
  };
  paraGraph?: {
    para: string;
    subQuestions?: Array<{
      questionText?: string;
      options?: string[];
      correctAnswer?: string;
    }>;
  };

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
