import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { X } from "lucide-react";
import Uploadimage from "./Uploadimage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
const defaultBlanks = {
  answer: [],
  option: [],
  blankQuestion: "",
  question: "",
};

const Cloze = ({ initialData, onSave, isMobile }: QuestiondivProps) => {
  const [blankQuestion, setBlankQuestion] = useState("");
  const [blankOption, setBlankOption] = useState({ position: 0, text: "" });
  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData || emptyQuestion
  );
  const [open, setOpen] = useState<boolean>();
  const [disable, setDisable] = useState<boolean>(false);

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
    <div className="border flex flex-col gap-4 sm:w-full sm:p-2">
      <div className="w-full flex flex-col max-md:items-start font-semibold gap-3 p-2">
        <div className="flex max-md:flex-col items-center sm:justify-between">
          <label htmlFor="Questiontype">Type: {questionData.type}</label>
          <div className="flex items-center gap-5">
            <div className="flex items-center flex-col ">
              <Uploadimage
                onUpload={(url) =>
                  setQuestionData((prev) => ({
                    ...prev,
                    imageUrl: url,
                  }))
                }
                disable={disable}
              />
            </div>
            {questionData.imageUrl && (
              <div className="">
                {isMobile ? (
                  <Drawer open={open}>
                    <DrawerTrigger className="w-fit flex justify-end">
                      <div className="bg-[#0F172B] p-2 rounded-lg text-zinc-50">
                        PreviewImage
                      </div>
                    </DrawerTrigger>

                    <DrawerContent className="flex flex-col h-[60dvh] w-screen p-0">
                      <DrawerHeader className="shrink-0 p-4">
                        <DrawerTitle>Image</DrawerTitle>
                      </DrawerHeader>
                      <Image
                        height="60"
                        width="300"
                        src={questionData.imageUrl}
                        alt="Uploaded"
                        className="w-full h-96 object-contain rounded-lg"
                      />
                      <DrawerFooter className="flex items-center gap-5 w-full flex-row justify-around pb-10  ">
                        <Button
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }));
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          Continue
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog open={open}>
                    <DialogTrigger className="w-full flex justify-start">
                      <div className="bg-[#0F172B] p-2 rounded-lg text-zinc-50">
                        Preview Image
                      </div>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col h-4/5 overflow-hidden min-w-2xl ">
                      <DialogHeader>
                        <DialogTitle>Form Image</DialogTitle>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <Image
                          height="60"
                          width="300"
                          src={questionData.imageUrl}
                          alt="Uploaded"
                          className="w-full h-96 object-contain rounded-lg"
                        />
                      </div>
                      <DialogFooter className="flex items-center gap-5 w-48 justify-around">
                        <Button
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }));
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          Continue
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </div>

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
              }}
              disabled={!!questionData.blanks?.question?.trim()}
            >
              Add
            </Button>
          </div>

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
              value={blankOption.position}
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
