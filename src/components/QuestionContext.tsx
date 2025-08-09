// QuestionsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { QuestionsClient } from "@/types/ApiTypes";

interface QuestionsContextType {
  questions: QuestionsClient[];
  addQuestion: (q: QuestionsClient) => void;
  updateQuestion: (index: number, q: QuestionsClient) => void;
  removeQuestion: (index: number) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(
  undefined
);

export function QuestionsProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<QuestionsClient[]>([]);

  const addQuestion = (q: QuestionsClient) => {
    setQuestions((prev) => [...prev, q]);
  };

  const updateQuestion = (index: number, q: QuestionsClient) => {
    setQuestions((prev) =>
      prev.map((question, i) => (i === index ? q : question))
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <QuestionsContext.Provider
      value={{ questions, addQuestion, updateQuestion, removeQuestion }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
}
