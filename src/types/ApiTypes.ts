

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
    option: string[];
    answer: Array<{
      position: number;
      text: string;
    }>;
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
    answer: [],
    option: [],
  },
  paraGraph: {
    para: "",
    subQuestions: [],
  },
  options: [],
};
// Mongoose document type (for server-side usage)
