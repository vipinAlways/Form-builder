"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import { QuestiondivProps } from "./QuestionForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
import Uploadimage from "./Uploadimage";
import Image from "next/image";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const Comprehension = ({ initialData, onSave, isMobile }: QuestiondivProps) => {
  const [newPara, setNewPara] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  
  const [newSubQText, setNewSubQText] = useState("");
  const [newOption, setNewOption] = useState("");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionData, setQuestionData] = useState<QuestionsClient>(
    initialData!
  );

  const havePara = !!questionData.paraGraph?.para;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questionData.paraGraph?.subQuestions || []);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setQuestionData((prev) => ({
      ...prev,
      paraGraph: {
        ...(prev.paraGraph || { para: "", subQuestions: [] }),
        subQuestions: items,
      },
    }));
  };

  const handleAddPara = () => {
    if (!newPara.trim()) {
      toast.error("Paragraph is empty");
      return;
    }
    if (!havePara) {
      setQuestionData((prev) => ({
        ...prev,
        paraGraph: {
          ...(prev.paraGraph || { para: "", subQuestions: [] }),
          para: newPara,
          subQuestions: prev.paraGraph?.subQuestions || [],
        },
      }));
    } else {
      setQuestionData((prev) => ({
        ...prev,
        paraGraph: {
          ...(prev.paraGraph || { para: "", subQuestions: [] }),
          para: "",
          subQuestions: prev.paraGraph?.subQuestions || [],
        },
      }));
      setNewPara("");
    }
  };

  const handleAddSubQuestion = () => {
    if (!newSubQText.trim()) {
      toast.error("Subquestion text is empty");
      return;
    }
    if (currentOptions.length === 0) {
      toast.error("Add at least one option");
      return;
    }
    if (!correctAnswer) {
      toast.error("Set the correct answer");
      return;
    }

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

    setNewSubQText("");
    setCurrentOptions([]);
    setCorrectAnswer("");
  };

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
    <div className="border flex flex-col gap-4 p-4 sm:w-full">
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
              disable={false}
            />
          </div>
          {questionData.imageUrl && (
            <div>
              {isMobile ? (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger className="w-fit flex justify-end">
                    <div className="bg-[#0F172B] p-2 rounded-lg text-zinc-50">
                      Preview Image
                    </div>
                  </DrawerTrigger>

                  <DrawerContent className="flex flex-col h-[60dvh] w-screen p-0">
                    <DrawerHeader className="shrink-0 p-4">
                      <DrawerTitle>Image</DrawerTitle>
                    </DrawerHeader>
                    <Image
                      height={60}
                      width={300}
                      src={questionData.imageUrl}
                      alt="Uploaded"
                      className="w-full h-96 object-contain rounded-lg"
                    />
                    <DrawerFooter className="flex items-center gap-5 w-full flex-row justify-around pb-10">
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
                      <Button onClick={() => setOpen(false)}>Continue</Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className="w-full flex justify-start">
                    <div className="bg-[#0F172B] p-2 rounded-lg text-zinc-50">
                      Preview Image
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col h-4/5 overflow-hidden min-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Form Image</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                      <Image
                        height={60}
                        width={300}
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
                      <Button onClick={() => setOpen(false)}>Continue</Button>
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
              questionText:
                e.target.value ?? "Read The Para and Solve Given Questions",
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

      <div className="border-2 border-zinc-50 p-2 text-sm">
        {questionData.paraGraph?.para && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subQuestions" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                  style={{
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {(questionData.paraGraph?.subQuestions || []).map(
                    (subQ, index) => (
                      <Draggable
                        key={`subquestion-${index}`}
                        draggableId={`subquestion-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-full p-3 border rounded-md bg-white shadow-sm transition-shadow ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50 z-50"
                                : ""
                            }`}
                            style={{
                              userSelect: 'none',
                              ...(snapshot.isDragging 
                                ? provided.draggableProps.style 
                                : {
                                    position: 'static',
                                    left: 'unset',
                                    top: 'unset',
                                    right: 'unset',
                                    bottom: 'unset',
                                    transform: 'none',
                                    zIndex: 'auto'
                                  }
                              ),
                              ...(snapshot.isDragging && {
                                zIndex: 1000,
                                pointerEvents: 'auto'
                              })
                            }}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="font-semibold text-gray-800">
                                Q{index + 1}: {subQ.questionText}
                              </div>
                              <ul className="list-none space-y-1">
                                {subQ.options?.map((opt, idx) => (
                                  <li
                                    key={idx}
                                    className={`pl-4 py-1 rounded ${
                                      opt === subQ.correctAnswer
                                        ? "font-bold text-green-600 bg-green-50 border-l-4 border-green-500"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + idx)}. {opt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="mt-6 space-y-4 border-t pt-4">
              <label className="flex flex-col gap-1">
                <span className="font-medium">Subquestion Text</span>
                <input
                  type="text"
                  value={newSubQText}
                  onChange={(e) => setNewSubQText(e.target.value)}
                  className="border rounded p-2"
                  placeholder="Enter your subquestion"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">Add Option</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="border rounded p-2 flex-1"
                    placeholder="Enter option text"
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

              {currentOptions.length > 0 && (
                <div className="space-y-2">
                  <span className="font-medium">Current Options:</span>
                  {currentOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{String.fromCharCode(65 + idx)}. {opt}</span>
                      <Button
                        variant={opt === correctAnswer ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setCorrectAnswer(opt === correctAnswer ? "" : opt)
                        }
                      >
                        {opt === correctAnswer ? "✅ Correct" : "Set Correct"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentOptions(prev => prev.filter((_, i) => i !== idx));
                          if (opt === correctAnswer) setCorrectAnswer("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handleAddSubQuestion}
                disabled={!newSubQText.trim() || currentOptions.length === 0 || !correctAnswer}
              >
                Add Subquestion
              </Button>
            </div>
          </DragDropContext>
        )}
      </div>

      <Button className="w-full mt-4" onClick={handleSave}>
        Save Question
      </Button>
    </div>
  );
};

export default Comprehension;