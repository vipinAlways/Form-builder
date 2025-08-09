import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Comprehension = ({ initialData, onSave }: QuestiondivProps) => {
  const [newPara, setNewPara] = useState("");
  const [newSubQText, setNewSubQText] = useState("");
  const [newOption, setNewOption] = useState("");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData!
  );

  const havePara = !!questionData.paraGraph?.para;
  const handleAddPara = () => {
    if (!newPara.trim()) toast("Para is Emtpy");
    if (!havePara) {
      setQuestionData((prev) => ({
        ...prev,
        paraGraph: {
          ...(prev.paraGraph || { para: "", subQuestions: [] }),
          para: newPara,
        },
      }));
    } else {
      setQuestionData((prev) => ({
        ...prev,
        paraGraph: {
          ...(prev.paraGraph || { para: "", subQuestions: [] }),
          para: "",
        },
      }));
    }
  };

  const handleAddSubQuestion = () => {
    if (!newSubQText.trim() || currentOptions.length === 0 || !correctAnswer)
      return;

    setQuestionData((prev) => ({
      ...prev,
      paraGraph: {
        ...(prev.paraGraph || { para: "", subQuestions: [] }),
        subQuestions: [
          ...(prev.paraGraph?.subQuestions || []),
          {
            questionText: newSubQText,
            options: currentOptions,
            correctAnswer,
          },
        ],
      },
    }));

    // reset subquestion form
    setNewSubQText("");
    setCurrentOptions([]);
    setCorrectAnswer("");
  };

  // Save entire question
  const handleSave = () => {
    onSave(questionData);
    setQuestionData(emptyQuestion);
    setNewPara("");
    setNewSubQText("");
    setCurrentOptions([]);
    setCorrectAnswer("");
  };

  useEffect(() => {
    setQuestionData((prev) => ({ ...prev, type: "comprehension" }));
  }, [initialData]);

  return (
    <div className="border flex flex-col gap-4 p-4">
      <label>Type: {questionData.type}</label>

      <label className="flex flex-col gap-1.5 items-start w-full">
        Question
        <textarea
          value={questionData.questionText}
          onChange={(e) =>
            setQuestionData((prev) => ({
              ...prev,
              questionText: e.target.value || "Read The Para and Solve Given Questions",
            }))
          }
          required
          className="w-full outline outline-black rounded-lg p-2 h-11"
          placeholder="Enter Question Optional"
        />
      </label>

      <label className="flex flex-col gap-1">
        Paragraph
        <div className="flex gap-2">
          <textarea
            value={newPara}
            onChange={(e) => setNewPara(e.target.value)}
            className={cn(
              "border rounded p-2 flex-1",
              !!questionData.paraGraph?.para?.trim() && "min-h-36"
            )}
            placeholder="Enter paragraph"
            disabled={!!questionData.paraGraph?.para?.trim()}
          />
          <Button onClick={handleAddPara}>{havePara ? "Edit" : "Add"}</Button>
        </div>
      </label>

      <div className="border-2 border-zinc-50 p-2 text-sm ">
        {questionData.paraGraph?.para && (
          <div className="border-t pt-4">
            <label className="flex flex-col gap-1">
              Subquestion Text
              <input
                type="text"
                value={newSubQText}
                onChange={(e) => setNewSubQText(e.target.value)}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col gap-1 mt-2">
              Add Option
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="border rounded p-2 flex-1"
                />
                <Button
                  onClick={() => {
                    if (!newOption.trim()) return;
                    setCurrentOptions((prev) => [...prev, newOption]);
                    setNewOption("");
                  }}
                >
                  Add
                </Button>
              </div>
            </label>

            <div className="mt-2 flex flex-col gap-1">
              {currentOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span>{opt}</span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCorrectAnswer(opt === correctAnswer ? "" : opt)
                    }
                  >
                    {opt === correctAnswer ? "✅ Correct" : "Set Correct"}
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full " onClick={handleAddSubQuestion}>
              Add Subquestion
            </Button>
          </div>
        )}
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Question
      </Button>
    </div>
  );
};

export default Comprehension;
