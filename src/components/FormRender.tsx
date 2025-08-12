import { FormData } from "@/app/create-form/action";
import { QuestionsClient, StudentAnswer } from "@/types/ApiTypes";
import Image from "next/image";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import { submitAnswer } from "@/app/Your-form/action";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

interface Props {
  formDetails: FormData;
  questions: QuestionsClient[];
  formId: string;
}

function FormRender({ formDetails, questions, formId }: Props) {
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);

  const [itemsState, setItemsState] = useState(() =>
    questions.reduce((acc, q, index) => {
      const qKey = q._id ?? `local-${index}`;
      if (q.type === "categorize") {
        acc[qKey] = {
          pool: q.categorizeOptions?.items || [],
          categories: q.categorizeOptions?.Belongs.map(() => []) || [],
        };
      } else if (q.type === "cloze") {
        acc[qKey] = {
          pool: q.blanks?.option || [],
          blank: [],
        };
      }
      return acc;
    }, {} as Record<string, any>)
  );

  const mutation = useMutation({
    mutationFn: submitAnswer,
    onSuccess: () => {
      toast.success("Submission successful");
      redirect(`/form/success/${formId}`)
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateAnswer = (
    questionId: string,
    type: StudentAnswer["type"],
    answer: any
  ) => {
    setStudentAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      const newAnswer = { questionId, type, answer };

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const [qId, srcZone] = source.droppableId.split("|");
    const [destQId, destZone] = destination.droppableId.split("|");

    if (qId !== destQId) return;

    setItemsState((prev) => {
      const newState = structuredClone(prev);

      const getList = (qid: string, zone: string) => {
        if (zone === "pool" || zone === "blank") {
          return newState[qid][zone];
        }
        const idx = parseInt(zone, 10);
        return newState[qid].categories[idx];
      };

      const sourceList = getList(qId, srcZone);
      const destList = getList(destQId, destZone);

      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      updateAnswer(
        qId,
        questions.find((q) => q._id === qId)?.type as any,
        newState[qId]
      );

      return newState;
    });
  };

  return (
    <div
      className={`flex flex-col gap-3 w-full h-full p-2 text-[${formDetails.theme.color}] bg-[${formDetails.theme.bg}] border-2 rounded-lg`}
    >
      <h1 className="font-semibold text-2xl">{formDetails.title}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        {questions.map((ques, index) => (
          <div key={ques._id ?? `local-${index}`} className="flex gap-2">
            <span>Ques. {index + 1}</span>

            {/* Comprehension */}
            {ques.type === "comprehension" && (
              <div className="flex flex-col gap-1.5">
                <h1 className="font-semibold">{ques.questionText}</h1>
                {ques.imageUrl && (
                  <Image
                    src={ques.imageUrl}
                    alt="image"
                    height={60}
                    width={120}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <p className="max-w-4/5 break-words">{ques.paraGraph?.para}</p>
                <span className="font-semibold">Solve the Following</span>

                <ul className="flex gap-1 flex-col">
                  {ques.paraGraph?.subQuestions?.map((q, i) => (
                    <li key={i} className="flex gap-1">
                      <span>
                        {index + 1}.{i + 1}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span>
                          {q.questionText}
                          {q.questionText &&
                            !q.questionText.trim().endsWith("?") &&
                            "?"}
                        </span>
                        <ol>
                          {q.options?.map((option, oi) => (
                            <li key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`${ques._id ?? `local-${index}`}-${i}`}
                                checked={
                                  studentAnswers.find(
                                    (a) =>
                                      a.questionId ===
                                        `${
                                          ques._id ?? `local-${index}`
                                        }-${i}` &&
                                      a.type === "comprehension" &&
                                      a.answer.answer === option
                                  ) !== undefined
                                }
                                onChange={() =>
                                  updateAnswer(
                                    `${ques._id ?? `local-${index}`}-${i}`,
                                    "comprehension",
                                    { answer: option }
                                  )
                                }
                              />
                              <span>{option}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Categorize */}
            {ques.type === "categorize" && (
              <div className="flex flex-col gap-1.5">
                <h1 className="font-semibold">{ques.questionText}</h1>
                {ques.imageUrl && (
                  <Image
                    src={ques.imageUrl}
                    alt="image"
                    height={60}
                    width={120}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <Droppable
                  droppableId={`${ques._id ?? `local-${index}`}|pool`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <div
                      className="flex gap-3 flex-wrap w-4/5 border-4 p-3 rounded-xl"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {itemsState[ques._id ?? `local-${index}`]?.pool.map(
                        (item: string, ii: number) => (
                          <Draggable key={item} draggableId={item} index={ii}>
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 bg-green-500 text-white rounded-lg"
                              >
                                {item}
                              </span>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="flex gap-3 flex-wrap w-4/5 p-3 justify-around rounded-xl">
                  {ques.categorizeOptions?.Belongs.map((belong, bi) => (
                    <Droppable
                      key={bi}
                      droppableId={`${ques._id ?? `local-${index}`}|${bi}`}
                      direction="vertical"
                    >
                      {(provided) => (
                        <div
                          className="h-72 flex flex-col gap-0.5 border-4 w-36 text-center rounded-lg"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <span className="text-lg border-b-2">{belong}</span>
                          {itemsState[ques._id ?? `local-${index}`]?.categories[
                            bi
                          ].map((item: string, ii: number) => (
                            <Draggable key={item} draggableId={item} index={ii}>
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-blue-500 text-white rounded-lg"
                                >
                                  {item}
                                </span>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </div>
            )}

            {/* Cloze */}
            {ques.type === "cloze" && (
              <div className="flex flex-col gap-1.5">
                <h1 className="font-semibold">{ques.questionText}</h1>
                {ques.imageUrl && (
                  <Image
                    src={ques.imageUrl}
                    alt="image"
                    height={60}
                    width={120}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <Droppable
                  droppableId={`${ques._id ?? `local-${index}`}|pool`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <div
                      className="flex gap-3 flex-wrap w-4/5 border-4 p-3 rounded-xl"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {itemsState[ques._id ?? `local-${index}`]?.pool.map(
                        (item: string, ii: number) => (
                          <Draggable key={item} draggableId={item} index={ii}>
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 bg-green-500 text-white rounded-lg"
                              >
                                {item}
                              </span>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Blank */}
                <span className="text-lg font-semibold p-3 border rounded-lg flex items-center gap-2">
                  {ques.blanks?.blankQuestion.split("___")[0]}
                  <Droppable
                    droppableId={`${ques._id ?? `local-${index}`}|blank`}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-w-[80px] min-h-[30px] border-b-2 border-dashed flex items-center justify-center"
                      >
                        {itemsState[ques._id ?? `local-${index}`]?.blank.map(
                          (item: string, ii: number) => (
                            <Draggable key={item} draggableId={item} index={ii}>
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-1 bg-blue-500 text-white rounded"
                                >
                                  {item}
                                </span>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {ques.blanks?.blankQuestion.split("___")[1]}
                </span>
              </div>
            )}
          </div>
        ))}
      </DragDropContext>
      <Button
        onClick={() => mutation.mutate({ formId, answers: studentAnswers })}
      >
        Save
      </Button>
    </div>
  );
}

export default FormRender;
