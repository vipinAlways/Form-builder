import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { X } from "lucide-react";

const defaultBlanks = {
  answer: [],
  option: [],
  blankQuestion: "",
  question: "",
};

const Cloze = ({ initialData, onSave }: QuestiondivProps) => {
  const [blankQuestion, setBlankQuestion] = useState("");
  const [blankOption, setBlankOption] = useState({ position: 0, text: "" });
  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData || emptyQuestion
  );

  const handleSave = () => {
    onSave(questionData);
    setQuestionData({
      ...emptyQuestion,
      type: "cloze",
      blanks: { ...defaultBlanks },
    });
  };

  useEffect(() => {
    if (initialData) {
      setQuestionData((prev) => ({
        ...prev,
        ...initialData,
        type: "cloze",
      }));
    }
  }, [initialData]);

  return (
    <div className="border flex flex-col gap-4">
      <div className="w-full flex flex-col max-md:items-start font-semibold gap-3 p-2">
        <label htmlFor="Questiontype">Type: {questionData.type}</label>

       
        <label className="flex flex-col gap-1.5 items-start w-full">
          Question
          <textarea
            value={questionData.questionText}
            onChange={(e) =>
              setQuestionData((prev) => ({
                ...prev,
                questionText: e.target.value || "Fill in the Blanks",
              }))
            }
            required
            className="w-full outline outline-black rounded-lg p-2 h-11"
            placeholder="Enter Question Optional"
          />
        </label>

        <div className="flex flex-col gap-2">
          <label className="font-semibold md:text-xl text-lg">Add Text</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={blankQuestion}
              onChange={(e) => setBlankQuestion(e.target.value)}
              placeholder="Enter category name"
              className="border rounded px-2 py-1"
              disabled={!!questionData.blanks?.question?.trim()}
            />
            <Button
              onClick={() => {
                if (!blankQuestion.trim()) return;
                setQuestionData((prev) => ({
                  ...prev,
                  blanks: {
                    ...(prev.blanks || defaultBlanks),
                    question: blankQuestion,
                  },
                }));
                setBlankQuestion("");
              }}
              disabled={!!questionData.blanks?.question?.trim()}
            >
              Add
            </Button>
          </div>

          {/* Display question */}
          {questionData.blanks?.question && (
            <span className="flex gap-1.5 items-center text-sm border bg-zinc-500 w-fit p-1.5 rounded-lg font-semibold">
              {questionData.blanks.question}
              <X
                onClick={() =>
                  setQuestionData((prev) => ({
                    ...prev,
                    blanks: {
                      ...(prev.blanks || defaultBlanks),
                      question: "",
                    },
                  }))
                }
                className="md:size-6 size-3 hover:border cursor-pointer"
              />
            </span>
          )}
        </div>

        {/* Add blanks */}
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex gap-2 mt-2">
            <select
              className="border rounded px-2 py-1 flex-1 w-40"
              value={blankOption.position || ""}
              onChange={(e) => {
                const idx = Number(e.target.value);
                const word =
                  questionData.blanks?.question.split(" ")[idx] || "";
                setBlankOption({ text: word, position: idx });
              }}
            >
              <option value="">Select Empty</option>
              {questionData.blanks?.question.split(" ").map((word, index) => (
                <option key={index} value={index} className="uppercase">
                  {word}
                </option>
              ))}
            </select>

            <Button
              onClick={() => {
                if (!blankOption.text.trim()) return;

                setQuestionData((prev) => {
                  const originalWords = (prev.blanks?.question || "").split(
                    " "
                  );

                  const allPositions = [
                    ...(prev.blanks?.answer?.map((a) => a.position) || []),
                    blankOption.position,
                  ];

                  const updatedBlankQuestion = originalWords
                    .map((word, idx) =>
                      allPositions.includes(idx) ? "_______" : word
                    )
                    .join(" ");

                  return {
                    ...prev,
                    blanks: {
                      ...(prev.blanks || defaultBlanks),
                      option: [
                        ...(prev.blanks?.option || []),
                        blankOption.text,
                      ],
                      answer: [
                        ...(prev.blanks?.answer || []),
                        {
                          position: blankOption.position,
                          text: blankOption.text,
                        },
                      ],
                      blankQuestion: updatedBlankQuestion,
                    },
                  };
                });

                setBlankOption({ position: 0, text: "" });
              }}
            >
              Add
            </Button>
          </div>

          <ul className="list-disc list-inside text-lg">
            {questionData.blanks?.option.map((ans, index) => (
              <li key={index}>{ans}</li>
            ))}
          </ul>

          <span className="text-lg">
            Question: {questionData.blanks?.blankQuestion ?? ""}
          </span>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Question
        </Button>
      </div>
    </div>
  );
};

export default Cloze;
