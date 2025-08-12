"use client";
import { useQuestions } from "@/components/QuestionContext";
import { QuestionForm } from "@/components/QuestionForm";
import { QuestionsList } from "@/components/QuestionsList";
import { Button } from "@/components/ui/button";
import { QuestionsClient } from "@/types/ApiTypes";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useEffect, useState } from "react";
import { createForm, FormData } from "./action";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import Uploadimage from "@/components/Uploadimage";
import Image from "next/image";
import FormRender from "@/components/FormRender";
import { redirect } from "next/navigation";

const Page = () => {
  const { questions, addQuestion, updateQuestion } = useQuestions();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const [formTitle, setFormTitle] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [render, setRender] = useState<string>("create");
  const [open, setOpen] = useState<boolean>();
  const [disable, setDisable] = useState<boolean>(false);
  const [formTheme, setFormTheme] = useState<{ bg: string; color: string }>({
    bg: "#ffffff",
    color: "#000000",
  });
  const mutation = useMutation({
    mutationKey: ["create-form"],
    mutationFn: createForm,
    onSuccess: () => {
      toast("Form Created Successfully");
      redirect("/");
    },
    
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
  const handleRender = () => {
    if (!formTitle) {
      toast("Title is Missing ");
      return;
    } else {
      setRender("loading");
      setTimeout(() => {
        setRender("Preview");
      }, 1500);
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
  useEffect(() => {
    setDisable(headerImage !== "");
  }, [headerImage]);

  const formDetails: FormData = {
    title: formTitle,
    questions: questions,
    theme: formTheme,
    headerImage: headerImage,
  };

  return (
    <div className="w-full h-full p-4 relative">
      <form
        onSubmit={saveForm}
        className=" w-full h-full  mx-auto border-2 border-black rounded-lg p-4 flex flex-col gap-4"
      >
        {render === "create" ? (
          <>
            <div className="w-full flex items-center justify-between max-sm:flex-col gap-1.5">
              <div className="flex gap-1.5 sm:flex-col items-center sm:items-start text-lg">
                <label htmlFor="title">Title :</label>
                <input
                  type="text"
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="h-10 py-1.5 sm:px-3 p-1.5 font-semibold  outline rounded-xl border"
                  required
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
                      setFormTheme((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
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
            <div className="flex items-center gap-5">
              <div className="flex items-center flex-col ">
                <Uploadimage onUpload={setHeaderImage} disable={disable} />
              </div>
              {headerImage && (
                <div className="">
                  {isMobile ? (
                    <Drawer open={open} onOpenChange={setOpen}>
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
                          src={headerImage}
                          alt="Uploaded"
                          className="w-full h-96 object-contain rounded-lg"
                        />
                        <DrawerFooter className="flex items-center gap-5 w-full flex-row justify-around pb-10  ">
                          <Button
                            onClick={() => {
                              setHeaderImage("");
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
                    <Dialog>
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
                            src={headerImage}
                            alt="Uploaded"
                            className="w-full h-96 object-contain rounded-lg"
                          />
                        </div>
                        <DialogFooter className="flex items-center gap-5 w-48 justify-around">
                          <Button
                            onClick={() => {
                              setHeaderImage("");
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
            <div
              style={{
                color: formTheme.color,
                backgroundColor: formTheme.bg,
              }}
              className="p-3 rounded-lg"
            >
              <div className="">
                <div className="flex gap-4 flex-col">
                  <div className="w-full flex justify-end">
                    {isMobile ? (
                      <Drawer>
                        <DrawerTrigger className="">
                          <div className="bg-[#0F172B] p-3 rounded-lg text-zinc-50">
                            Add Question
                          </div>
                        </DrawerTrigger>

                        <DrawerContent className="flex flex-col h-[100dvh] w-screen p-0">
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
                        <DialogTrigger className=" flex justify-end ">
                          <div className="bg-[#0F172B] p-3 rounded-lg text-zinc-50">
                            Add Question
                          </div>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col h-[80dvh] w-full overflow-hidden min-w-2xl ">
                          <DialogHeader>
                            <DialogTitle>Add Question</DialogTitle>
                            <DialogDescription>
                              Note : Please Check the Question and Spellings
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex-1 overflow-y-scroll h-full overflow-x-hidden w-full relative">
                            <QuestionForm
                              initialData={selectedQuestion}
                              onSave={handleSaveQuestion}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="sm:min-w-xl  h-[70dvh] overflow-y-scroll ">
                    <QuestionsList questions={questions} isMobile={isMobile} />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <FormRender
            formDetails={formDetails}
            isSubmitted={true}
            questions={questions}
          />
        )}
        <div>
          {questions.length !== 0 &&
            (render === "create" ? (
              <div className="w-full flex items-center justify-around">
                <Link
                  href={"/"}
                  className="rounded-md bg-zinc-500/80 hover:bg-zinc-500 py-1.5 px-2 "
                >
                  Cancel
                </Link>
                <Button onClick={handleRender}>Preview</Button>
              </div>
            ) : render === "loading" ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">
                Wait It Will tak a whil
              </div>
            ) : (
              <Button type="submit">Save Form</Button>
            ))}
        </div>
      </form>
    </div>
  );
};

export default Page;
