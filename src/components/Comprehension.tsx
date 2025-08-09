import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { X } from "lucide-react";

const Comprehension = ({ initialData, onSave }: QuestiondivProps) => {
  const [blankQuestion, setBlankQuestion] = useState<string>("");
  const [newPara, setNewPara] = useState("");
  const [newItem, setNewItem] = useState<string>("");
  const [asnwerBlongs, setAsnwerBlongs] = useState<string>("");
  const [newSubQuestion, setNewSubQuestion] = useState("");

  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData!
  );

  const handleSave = () => {
    onSave(questionData);
    setQuestionData(emptyQuestion);
    setNewPara("");
    setNewSubQuestion("");
  };
  useEffect(() => {
    setQuestionData((prev) => ({ ...prev, type: "categorize" }));
  }, [initialData]);
  return (
    <div className="border  flex flex-col  gap-4">
      <div className="w-full flex  md:text-lg text-sm flex-col max-md:items-start font-semibold gap-3 p-2">
        <label htmlFor="Questiontype">Type: {questionData.type}</label>

        <label
          htmlFor="questionText"
          className="flex flex-col gap-1.5 items-start w-full"
        >
          Question
          <textarea
            id="questionText"
            value={questionData.questionText}
            onChange={(e) =>
              setQuestionData((prev) => ({
                ...prev,
                questionText: e.target.value || "Comprehension Question",
              }))
            }
            required
            className="w-full outline outline-black rounded-lg p-2 h-11"
            placeholder="Enter Question Optional"
          />
        </label>
        <label
          htmlFor="paraText"
          className="flex flex-col gap-1.5 items-start w-full"
        >
          ParaGraph
          <textarea
            id="paraText"
            value={newPara}
            onChange={(e) => setNewPara(e.target.value)}
            required
            className="w-full outline outline-black rounded-lg p-2 min-h-36"
            placeholder="Enter Paragraph"
            disabled={!!questionData.paraGraph?.para?.trim()}
          />
          <Button
            onClick={() => {
              if (!newPara.trim()) return;
              setQuestionData((prev) => ({
                ...prev,
                paraGraph: {
                  ...(prev.paraGraph || { para: "", subQuestions: [] }),
                  para: newPara,
                },
              }));
              setNewPara("");
            }}
            disabled={!!questionData.paraGraph?.para?.trim()}
          >
            Add
          </Button>
        </label>

        <div className="flex flex-col gap-6">
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
                      ...(prev.blanks || {
                        answer: [],
                        option: [],
                        question: blankQuestion,
                        blankQuestion: "",
                      }),
                    },
                  }));
                  setBlankQuestion("");
                }}
                disabled={!!questionData.blanks?.question?.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 w-full">
              <span className="flex gap-1.5 items-center text-sm border bg-zinc-500 w-fit p-1.5 rounded-lg font-semibold">
                {questionData.blanks?.question} {blankQuestion}
                <X
                  onClick={() => {
                    setQuestionData((prev) => ({
                      ...prev,
                      blanks: {
                        ...(prev.blanks || { answer: [], option: [] }),
                        question: "",
                        blankQuestion: prev.blanks?.blankQuestion || "",
                      },
                    }));
                  }}
                  className="md:size-6 size-3 hover:border"
                />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <div className=" rounded-lg">
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={`Add item for`}
                  className="border rounded px-2 py-1   "
                />
                <select
                  name=""
                  id=""
                  className="border rounded px-2 py-1 flex-1 w-40"
                  value={asnwerBlongs}
                  onChange={(e) => setAsnwerBlongs(e.target.value)}
                >
                  <option value="">Select Belongies</option>
                  {questionData.categorizeOptions?.Belongs.map(
                    (belong, index) => (
                      <option key={index} value={belong} className="uppercase">
                        {belong}
                      </option>
                    )
                  )}
                </select>

                <Button
                  onClick={() => {
                    if (!newItem.trim() || !asnwerBlongs.trim()) return;

                    setQuestionData((prev) => ({
                      ...prev,
                      categorizeOptions: {
                        ...(prev.categorizeOptions || {
                          items: [],
                          Belongs: [],
                          asnwer: [],
                        }),
                        items: [
                          ...(prev.categorizeOptions?.items || []),
                          newItem,
                        ],
                        asnwer: [
                          ...(prev.categorizeOptions?.asnwer || []),
                          { text: newItem, belongs: asnwerBlongs },
                        ],
                        Belongs: prev.categorizeOptions?.Belongs || [],
                      },
                    }));

                    setNewItem("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <ul className="list-disc list-inside text-lg ">
              {questionData.categorizeOptions?.asnwer.map((ans, index) => (
                <li key={index}>
                  <span>{ans.text}</span> <span>{ans.belongs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Question
        </Button>
      </div>
    </div>
  );
};

export default Comprehension;
