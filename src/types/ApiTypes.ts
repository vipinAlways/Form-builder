

// Client-side TypeScript interface
export interface QuestionsClient {
  type: "categorize" | "cloze" | "comprehension";
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
// Mongoose document type (for server-side usage)
