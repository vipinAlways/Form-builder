import { QuestionsClient } from "@/types/ApiTypes";
import Image from "next/image";
import React from "react";

interface QuestionsListProps {
  questions: QuestionsClient[];
  onSelect: (index: number) => void;
}

export function QuestionsList({ questions, onSelect }: QuestionsListProps) {
  return (
    <div>
      <h2>Questions List</h2>
      {questions.length === 0 && <p>No questions added yet.</p>}
      <ul>
        {questions.map((q, i) => (
          <li
            key={i}
            className="cursor-pointer mb-3"
            onClick={() => onSelect(i)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              <div className="flex-1">
                {q.imageUrl && (
                  <Image
                    src={q.imageUrl}
                    alt="Questionimage"
                    width={60}
                    height={60}
                    className="object-cover aspect-1/1"
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
