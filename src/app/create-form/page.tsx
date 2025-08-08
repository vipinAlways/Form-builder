"use client";
import { Button } from "@/components/ui/button";
import { QuestionsClient } from "@/types/ApiTypes";

import React, { useState } from "react";

const Page = () => {
  const emptyQuestion: QuestionsClient = {
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

  const [questions, setQuestions] = useState<QuestionsClient[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionsClient>(emptyQuestion);
  const [formTitle, setFormTitle] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [formTheme, setFormTheme] = useState<{ bg: string; color: string }>({
    bg: "#ffffff",
    color: "#000000",
  });
  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) return;
    setQuestions((prev) => [...prev, currentQuestion]);
    setCurrentQuestion(emptyQuestion);
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title: formTitle,
      headerImage,
      theme: formTheme,
      questions,
    });
    
  };

  return (
    <div className="w-full h-screen p-4">
      <form
        onSubmit={saveForm}
        className="w-4/5 min-h-full mx-auto border-2 border-black rounded-lg  p-4 flex flex-col gap-4"
      >
        <div className="w-full flex items-center justify-between ">
          <div className="flex gap-1.5 flex-col  items-start text-sm sm:text-lg">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="h-10 py-1.5 px-3 font-semibold  outline rounded-xl border"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className=" flex items-center gap-1.5 text-sm sm:text-lg">
              <label htmlFor="color">Text</label>
              <input
                type="color"
                id="color"
                value={formTheme.color}
                onChange={(e) =>
                  setFormTheme((prev) => ({ ...prev, color: e.target.value }))
                }
                className="rounded-full h-10 w-10 p-0 border-0 appearance-none cursor-pointer"
              />
            </div>
            <div className=" flex items-center gap-1.5 text-lg sm:text-xl">
              <label htmlFor="Background">Background</label>
              <input
                type="color"
                id="Background"
                value={formTheme.bg}
                onChange={(e) =>
                  setFormTheme((prev) => ({ ...prev, bg: e.target.value }))
                }
                className="rounded-full h-10 w-10  appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div
          style={{
            color: formTheme.color,
            backgroundColor: formTheme.bg,
          }}
          className="h-12 p-3 border"
        >
          Preview text
        </div>

        <div className="border p-4 rounded-lg"></div>

        <Button type="submit">Save Form</Button>
      </form>
    </div>
  );
};

export default Page;
