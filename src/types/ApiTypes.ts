

// Client-side TypeScript interface
export interface QuestionsClient {
  type: "categorize" | "cloze" | "comprehension" | string;
  questionText: string;
  imageUrl?: string;
  categorizeOptions?: {
    items: string[];
    Belongs: string[];
    asnwer: Array<{
      text: string;
      belongs: string;
    }>;
  };
  blanks?: {
    blankQuestion:string
    option: string[];
    answer: Array<{
      position: number;
      text: string;
    }>;
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
  options?: string[];
}

export const emptyQuestion: QuestionsClient = {
  type: "categorize",
  questionText: "",
  imageUrl: "",
  categorizeOptions: {
    asnwer: [],
    Belongs: [],
    items: [],
  },
  blanks: {
    blankQuestion:"",
    answer: [],
    option: [],
    question:""
  },
  paraGraph: {
    para: "",
    subQuestions: [],
  },
  options: [],
};
// Mongoose document type (for server-side usage)
