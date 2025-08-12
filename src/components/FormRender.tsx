import { FormData } from "@/app/create-form/action";

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
import { QuestionsClient, StudentAnswer } from "@/types/ApiTypes";

interface Props {
  formDetails: FormData;
  questions: QuestionsClient[];
  formId?: string;
  isSubmitted: boolean;
}

type CategorizeState = {
  kind: "categorize";
  pool: string[];
  categories: string[][];
};

type ClozeState = {
  kind: "cloze";
  pool: string[];
  blank: string[];
};

type ItemsState = Record<string, CategorizeState | ClozeState>;



function FormRender({ formDetails, questions, formId, isSubmitted }: Props) {
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);

  const [itemsState, setItemsState] = useState<ItemsState>(() =>
    questions.reduce((acc, q, index) => {
      const qKey = q._id ?? `local-${index}`;

      if (q.type === "categorize") {
        acc[qKey] = {
          kind: "categorize",
          pool: q.categorizeOptions?.items || [],
          categories: q.categorizeOptions?.Belongs?.map(() => []) || [],
        };
      } else if (q.type === "cloze") {
        acc[qKey] = {
          kind: "cloze",
          pool: q.blanks?.option || [],
          blank: [],
        };
      }

      return acc;
    }, {} as ItemsState)
  );

  const mutation = useMutation({
    mutationFn: submitAnswer,
    onSuccess: () => {
      toast.success("Submission successful");
      if (formId) {
        redirect(`/form/success/${formId}`);
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateAnswer = (
    questionId: string,
    type: StudentAnswer["type"],
  
    answer:any
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

    setItemsState((prev: ItemsState) => {
      const newState: ItemsState = structuredClone(prev);
      const currentState = newState[qId];

      if (!currentState) return prev;

      const getList = (zone: string): string[] => {
        if (zone === "pool") {
          return currentState.pool;
        }
        if (zone === "blank" && currentState.kind === "cloze") {
          return currentState.blank;
        }
        if (currentState.kind === "categorize") {
          const idx = parseInt(zone, 10);
          return currentState.categories[idx] || [];
        }
        return [];
      };

      const sourceList = getList(srcZone);
      const destList = getList(destZone);

      if (!sourceList || !destList) return prev;

      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      const question = questions.find((q) => (q._id ?? `local-${questions.indexOf(q)}`) === qId);
      if (question && (question.type === "categorize" || question.type === "cloze")) {
        updateAnswer(qId, question.type, newState[qId]);
      }

      return newState;
    });
  };

  const getCategorizeState = (questionKey: string): CategorizeState | null => {
    const state = itemsState[questionKey];
    return state?.kind === "categorize" ? state : null;
  };

  const getClozeState = (questionKey: string): ClozeState | null => {
    const state = itemsState[questionKey];
    return state?.kind === "cloze" ? state : null;
  };

  return (
    <div
      className="flex flex-col gap-3 w-full h-full p-2 border-2 rounded-lg"
      style={{
        color: formDetails.theme.color,
        backgroundColor: formDetails.theme.bg,
      }}
    >
      <h1 className="font-semibold text-2xl">{formDetails.title}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        {questions.map((ques, index) => {
          const questionKey = ques._id ?? `local-${index}`;
          
          return (
            <div key={questionKey} className="flex gap-2">
              <span>Ques. {index + 1}</span>

              {ques.type === "comprehension" && (
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-semibold">{ques.questionText}</h1>
                  {ques.imageUrl && (
                    <Image
                      src={ques.imageUrl}
                      alt="Question image"
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
                                  name={`${questionKey}-${i}`}
                                  checked={
                                    studentAnswers.find(
                                      (a) =>
                                        a.questionId === `${questionKey}-${i}` &&
                                        a.type === "comprehension" &&
                                        a.answer.answer === option
                                    ) !== undefined
                                  }
                                  onChange={() =>
                                    updateAnswer(
                                      `${questionKey}-${i}`,
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

              {ques.type === "categorize" && (() => {
                const categorizeState = getCategorizeState(questionKey);
                if (!categorizeState) return null;

                return (
                  <div className="flex flex-col gap-1.5 w-full">
                    <h1 className="font-semibold">{ques.questionText}</h1>
                    {ques.imageUrl && (
                      <Image
                        src={ques.imageUrl}
                        alt="Question image"
                        height={60}
                        width={120}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}

                    <Droppable
                      droppableId={`${questionKey}|pool`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          className="flex gap-3 flex-wrap w-4/5 border-4 p-3 rounded-xl"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {categorizeState.pool.map((item: string, ii: number) => (
                            <Draggable
                              key={`${item}-pool-${ii}`}
                              draggableId={`${item}-pool-${ii}`}
                              index={ii}
                            >
                              {(provided, snapshot) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-green-500 text-white rounded-lg"
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
                                  {item}
                                </span>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <div className="flex gap-3 flex-wrap min-w-full/5 p-3 justify-around rounded-xl">
                      {ques.categorizeOptions?.Belongs?.map((belong, bi) => (
                        <Droppable
                          key={bi}
                          droppableId={`${questionKey}|${bi}`}
                          direction="vertical"
                        >
                          {(provided) => (
                            <div
                              className="h-72 flex flex-col gap-0.5 border-4 flex-1 text-center rounded-lg"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              <span className="text-lg border-b-2">{belong}</span>
                              {categorizeState.categories[bi]?.map((item: string, ii: number) => (
                                <Draggable
                                  key={`${item}-cat-${bi}-${ii}`}
                                  draggableId={`${item}-cat-${bi}-${ii}`}
                                  index={ii}
                                >
                                  {(provided, snapshot) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-2 bg-blue-500 text-white rounded-lg"
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
                );
              })()}

              {ques.type === "cloze" && (() => {
                const clozeState = getClozeState(questionKey);
                if (!clozeState) return null;

                return (
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-semibold">{ques.questionText}</h1>
                    {ques.imageUrl && (
                      <Image
                        src={ques.imageUrl}
                        alt="Question image"
                        height={60}
                        width={120}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}

                    <Droppable
                      droppableId={`${questionKey}|pool`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          className="flex gap-3 flex-wrap w-4/5 border-4 p-3 rounded-xl"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {clozeState.pool.map((item: string, ii: number) => (
                            <Draggable
                              key={`${item}-pool-${ii}`}
                              draggableId={`${item}-pool-${ii}`}
                              index={ii}
                            >
                              {(provided, snapshot) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-green-500 text-white rounded-lg text-wrap break-words"
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
                                  {item}
                                </span>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <div className="text-lg font-semibold p-3 border rounded-lg flex flex-wrap items-center gap-2">
                      <span>{ques.blanks?.blankQuestion?.split("___")[0] || ""}</span>
                      <Droppable
                        droppableId={`${questionKey}|blank`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-w-[80px] min-h-[30px] border-b-2 border-dashed flex items-center justify-center"
                          >
                            {clozeState.blank.map((item: string, ii: number) => (
                              <Draggable
                                key={`${item}-blank-${ii}`}
                                draggableId={`${item}-blank-${ii}`}
                                index={ii}
                              >
                                {(provided, snapshot) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-1 bg-blue-500 text-white rounded"
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
                                    {item}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <span>{ques.blanks?.blankQuestion?.split("___")[1] || ""}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </DragDropContext>
      
      {isSubmitted ? (
        <p className="text-center font-semibold">Can&#39;t Submit</p>
      ) : (
        <Button
          onClick={() => {
            if (formId) {
              mutation.mutate({ formId, answers: studentAnswers });
            }
          }}
          disabled={!formId}
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default FormRender;