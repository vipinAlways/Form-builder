import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { X } from "lucide-react";

const Categroirze = ({ initialData, onSave }: QuestiondivProps) => {
  const [newBelongs, setNewBelongs] = useState<string>("");

  const [newItem, setNewItem] = useState<string>("");
  const [asnwerBlongs, setAsnwerBlongs] = useState<string>("");

  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData!
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionData(emptyQuestion);
    onSave(questionData);
  };
  useEffect(() => {
    setQuestionData((prev) => ({ ...prev, type: "categorize" }));
  }, [initialData]);
  return (
    <div className="border w-full   flex flex-col  gap-4">
      <div className="w-full flex  md:text-lg text-sm flex-col max-md:items-start font-semibold gap-3 p-2">
        <label htmlFor="Questiontype">
          Type: {questionData.type}
        </label>

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
                questionText: e.target.value,
              }))
            }
            required
            className="w-full outline outline-black rounded-lg p-2 md:h-11 h-16"
            placeholder="Enter Question "
          />
        </label>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold md:text-xl text-lg">
              Add Belongies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBelongs}
                onChange={(e) => setNewBelongs(e.target.value)}
                placeholder="Enter category name"
                className="border rounded px-2 py-1"
              />
              <Button
                onClick={() => {
                  if (!newBelongs.trim()) return;
                  setQuestionData((prev) => ({
                    ...prev,
                    categorizeOptions: {
                      ...(prev.categorizeOptions || {
                        items: [],
                        Belongs: [],
                        asnwer: [],
                      }),
                      Belongs: [
                        ...(prev.categorizeOptions?.Belongs || []),
                        newBelongs,
                      ],
                    },
                  }));
                  setNewBelongs("");
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 w-3/5">
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

          <div className="flex flex-col gap-4 text-sm">
            <div className=" rounded-lg">
              <div className="flex gap-2 mt-2 max-sm:flex-col">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={`Add item for`}
                  className="border rounded px-2 py-1"
                />
                <select
                  name=""
                  id=""
                  className="border rounded px-2 py-1 flex-1 sm:w-40 w-full"
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

export default Categroirze;
