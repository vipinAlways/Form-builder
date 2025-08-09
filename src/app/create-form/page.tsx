"use client";
import { useQuestions } from "@/components/QuestionContext";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { QuestionForm } from "@/components/QuestionForm";
import { QuestionsList } from "@/components/QuestionsList";
import { Button } from "@/components/ui/button";
import { QuestionsClient } from "@/types/ApiTypes";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useState } from "react";
import { createForm } from "./action";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Page = () => {
  const { questions, addQuestion, updateQuestion } = useQuestions();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isMobile } = useIsMobile();
  const [formTitle, setFormTitle] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [formTheme, setFormTheme] = useState<{ bg: string; color: string }>({
    bg: "#ffffff",
    color: "#000000",
  });
  const mutation = useMutation({
    mutationKey: ["create-form"],
    mutationFn: createForm,
    onSuccess: () => toast("Form Created Successfully"),
    onError: (error) => toast.error("error" + error.message),
  });

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length !== 0) {
      mutation.mutate({
        questions: questions,
        theme: formTheme,
        title: formTitle,
      });
    } else {
      toast("No question Found");
    }
  };
  const handleSaveQuestion = (question: QuestionsClient) => {
    if (selectedIndex !== null) {
      updateQuestion(selectedIndex, question);
    } else {
      addQuestion(question);
    }
    setSelectedIndex(null);
  };

  const selectedQuestion =
    selectedIndex !== null ? questions[selectedIndex] : undefined;

  return (
    <div className="w-full h-screen p-4">
      <form
        onSubmit={saveForm}
        className="ms:w-4/5 w-full min-h-full mx-auto border-2 border-black rounded-lg  p-4 flex flex-col gap-4 "
      >
        <div className="w-full flex items-center justify-between max-sm:flex-col gap-1.5">
          <div className="flex gap-1.5 sm:flex-col items-center sm:items-start text-lg">
            <label htmlFor="title">Title :</label>
            <input
              type="text"
              id="title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="h-10 py-1.5 sm:px-3 p-1.5 font-semibold  outline rounded-xl border"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className=" flex items-center gap-1.5 text-lg">
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
          className="p-3 rounded-lg"
        >
          <div className="">
            <div className="flex gap-4 flex-col">
              <div className="flex-1">
                {isMobile ? (
                  <Drawer>
                    <DrawerTrigger className="w-fit flex justify-end">
                      <div className="bg-[#0F172B] p-3 rounded-lg text-zinc-50">
                        Add Question
                      </div>
                    </DrawerTrigger>

                    <DrawerContent className="flex flex-col h-[100dvh] w-screen p-0">
                      {/* Header stays fixed */}
                      <DrawerHeader className="shrink-0 p-4">
                        <DrawerTitle>Add Question</DrawerTitle>
                        <DrawerDescription>
                          Note: Please Check the Question and Spellings
                        </DrawerDescription>
                      </DrawerHeader>

                      <div className="flex-1 overflow-y-auto p-4 overflow-x-hidden">
                        <QuestionForm
                          initialData={selectedQuestion}
                          onSave={handleSaveQuestion}
                        />
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog>
                    <DialogTrigger className="w-full flex justify-end">
                      <div className="bg-[#0F172B] p-3 rounded-lg text-zinc-50">
                        Add Question
                      </div>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col h-4/5 overflow-hidden min-w-2xl ">
                      <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                        <DialogDescription>
                          Note : Please Check the Question and Spellings
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <QuestionForm
                          initialData={selectedQuestion}
                          onSave={handleSaveQuestion}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="flex-1">
                <QuestionsList
                  questions={questions}
                  onSelect={setSelectedIndex}
                />
                {selectedQuestion && (
                  <QuestionDisplay question={selectedQuestion} />
                )}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit">Save Form</Button>
      </form>
    </div>
  );
};

export default Page;
