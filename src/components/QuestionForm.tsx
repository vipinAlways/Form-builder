import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Cross, CrossIcon, X } from "lucide-react";

interface QuestiondivProps {
  initialData?: QuestionsClient;
  onSave: (question: QuestionsClient) => void;
}

export function QuestionForm({ initialData, onSave }: QuestiondivProps) {
  const [options, setOptions] = useState<string>("");
  const [questionText, setQuestionText] = useState(
    initialData?.questionText || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const [categorizeOptions, setCategorizeOptions] = useState<
    QuestionsClient["categorizeOptions"]
  >(initialData?.categorizeOptions || { items: [], Belongs: [], asnwer: [] });

  const [blanks, setBlanks] = useState<QuestionsClient["blanks"]>(
    initialData?.blanks || { option: [], answer: [] }
  );

  const [paraGraph, setParaGraph] = useState<QuestionsClient["paraGraph"]>(
    initialData?.paraGraph || { para: "", subQuestions: [] }
  );

  const [questionData, setQuestionData] =
    useState<QuestionsClient>(emptyQuestion);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    onSave(questionData);
  };

  return (
    <div className="border p-4 mb-6 flex flex-col gap-4">
      <div className="w-full flex items-center md:text-lg text-sm max-md:flex-col max-md:items-start font-semibold gap-3">
        <label htmlFor="Questiontype">
          Type:
          <select
            id="Questiontype"
            value={questionData.type}
            onChange={(e) =>
              setQuestionData((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <option value="categorize">Categorize</option>
            <option value="cloze">Cloze</option>
            <option value="comprehension">Comprehension</option>
          </select>
        </label>

        <label className="" htmlFor="QuestionImage">
          Image (optional):
          <input
            type="file"
            value={imageUrl}
            id="QuestionImage"
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
      </div>

      <label htmlFor="questionText">
        Question
        <textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          className="w-full outline outline-black rounded-lg p-2"
          placeholder="Enter Question"
        />
      </label>

      {questionData.type === "categorize" && (
        <div className="flex flex-col md:text-lg text-sm w-full gap-1.5">
          <label className="font-semibold md:text-xl text-lg w-full ">
            Enter the belongins{" "}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="outline-black px-3 py-1.5  rounded-lg outline"
            />
            <Button
              onClick={() => {
                setQuestionData((prev) => ({
                  ...prev,
                  categorizeOptions: {
                    Belongs: [
                      ...(prev.categorizeOptions?.Belongs || []),
                      options,
                    ],
                    items: prev.categorizeOptions?.items || [],
                    asnwer: prev.categorizeOptions?.asnwer || [],
                  },
                }));

                setOptions("");
              }}
            >
              add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 w-full">
            {questionData.categorizeOptions?.Belongs.map((belongs, index) => (
              <span
                key={index}
                className="flex gap-1.5 items-center text-sm border bg-zinc-500 w-fit p-1.5 rounded-lg font-semibold"
              >
                {belongs}{" "}
                <X
                  onClick={() => {
                    setQuestionData((prev) => ({
                      ...prev,
                      categorizeOptions: {
                        Belongs: prev.categorizeOptions
                          ? prev.categorizeOptions?.Belongs.filter(
                              (belong) => belong !== belongs
                            )
                          : [],

                        items: prev.categorizeOptions?.items || [],
                        asnwer: prev.categorizeOptions?.asnwer || [],
                      },
                    }));
                  }}
                  className="md:size-6 size-3 hover:border"
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="mt-4" onClick={handleSave}>
        Save Question
      </button>
    </div>
  );
}
