import { QuestionsClient } from "@/types/ApiTypes";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
    
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface QuestionsListProps {
  questions: QuestionsClient[];
  isMobile: boolean;
}

export function QuestionsList({ questions, isMobile }: QuestionsListProps) {
  return (
    <div className="flex flex-col gap-1 sm:w-full  min-w-xs">
      <h2>Questions List</h2>
      {questions.length === 0 && <p>No questions added yet.</p>}
      <ul>
        {questions.map((q, i) => (
          <li key={i} className="cursor-pointer mb-3">
            <div className="flex items-start max-md:flex-col gap-2 justify-between  w-full">
              <span className="font-bold">Question {i + 1}.</span>
              <div className="flex-1">
                <h1 className="flex p-2 rounded-lg font-semibold ">
                  <span className="w-2/3 text-wrap text-start">
                    {q.questionText ? q.questionText : "Solve Given Questions"}
                  </span>{" "}
                  <span className="w-1/3"> Types : {q.type}</span>
                </h1>
                <ul className="min-w-40">
                  {q.type === "categorize" ? (
                    q.categorizeOptions?.asnwer.map((ans, index) => (
                      <ol
                        key={index}
                        className="flex text-lg gap-4 p-1.5 border w-full"
                      >
                        <span className="font-semibold flex-1 text-center border-r-2">
                          {ans.belongs}
                        </span>{" "}
                        <span className="font-semibold flex-1 text-center">
                          {ans.text}
                        </span>{" "}
                      </ol>
                    ))
                  ) : q.type === "cloze" ? (
                    <>
                      <h3>{q.blanks?.blankQuestion}</h3>
                      {q.blanks?.option.map((ans, index) => (
                        <ol key={index} className="flex flex-col gap-2">
                          <span className="font-semibold">{ans}</span>{" "}
                        </ol>
                      ))}
                      <span>Anser : {q.blanks?.question}</span>
                    </>
                  ) : (
                    q.type === "comprehension" && (
                      <>
                        <p className="max-w-2xl whitespace-normal break-words font-semibold">
                          {q.paraGraph?.para}
                        </p>

                        {q.paraGraph?.subQuestions?.map((ques, index) => (
                          <li key={index} className="flex gap-2">
                            <span>
                              {i + 1}.{index + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold">
                                {ques.questionText}
                              </h4>
                              <ol>
                                {ques.options?.map((op, index) => (
                                  <li
                                    className={cn(
                                      op === ques.correctAnswer &&
                                        "text-green-700"
                                    )}
                                    key={index}
                                  >
                                    {op}
                                  </li>
                                ))}
                              </ol>
                              <p>{ques.correctAnswer}</p>
                            </div>
                          </li>
                        ))}
                      </>
                    )
                  )}
                </ul>
              </div>
              <div className="flex-1 w-full">
                {q.imageUrl && (
                  <div className="w-full flex-1">
                    {isMobile ? (
                      <Drawer>
                        <DrawerTrigger className="w-fit flex justify-end relative">
                          <div className="p-2 rounded-lg text-zinc-50  group">
                            <h1
                              className="opacity-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           group-hover:opacity-100 bg-transparent transition-all duration-100 ease-in "
                            >
                              PreviewImage
                            </h1>
                            {q.imageUrl && (
                              <Image
                                src={q.imageUrl}
                                alt="Questionimage"
                                width={60}
                                height={60}
                                className="w-32 object-cover  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-35 transition-all duration-100 ease-in"
                              />
                            )}
                          </div>
                        </DrawerTrigger>

                        <DrawerContent className="flex flex-col h-[60dvh] w-screen p-0">
                          <DrawerHeader className="shrink-0 p-4">
                            <DrawerTitle>Image</DrawerTitle>
                          </DrawerHeader>
                          <Image
                            height="60"
                            width="300"
                            src={q.imageUrl!}
                            alt="Uploaded"
                            className="w-full h-96 object-contain rounded-lg"
                          />
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <Dialog>
                        <DialogTrigger className="w-full flex justify-start">
                          <div className="p-2 rounded-lg w-32 h-32 border text-zinc-50 relative group">
                            <h1
                              className="opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           group-hover:opacity-100 bg-transparent transition-all duration-100 ease-in text-black "
                            >
                              PreviewImage
                            </h1>
                            {q.imageUrl && (
                              <Image
                                src={q.imageUrl}
                                alt="Questionimage"
                                width={120}
                                height={120}
                                className="w-full h-full  opacity-100 object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-35 transition-all duration-100 ease-in"
                              />
                            )}
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
                              src={q.imageUrl!}
                              alt="Uploaded"
                              className="w-full h-96 object-contain rounded-lg"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
