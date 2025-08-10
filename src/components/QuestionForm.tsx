import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Categroirze from "./Categroirze";
import Cloze from "./Cloze";
import Comprehension from "./Comprehension";
import { useIsMobile } from "@/hooks/use-mobile";

export interface QuestiondivProps {
  initialData?: QuestionsClient;
  onSave: (question: QuestionsClient) => void;
  isMobile?: boolean;
}

export function QuestionForm({ initialData, onSave }: QuestiondivProps) {
  const isMobile = useIsMobile();
  const [type, setTypes] = useState<string>("");

  return (
    <div className="border  flex flex-col  gap-4 justify-center items-center h-full">
      <div className="w-full flex  md:text-lg text-sm flex-col  items-center justify-center h-full font-semibold gap-3 p-2">
        <label htmlFor="Questiontype" className="flex items-center gap-1.5">
          Type:
          <select
            id="Questiontype"
            value={type}
            onChange={(e) => setTypes(e.target.value)}
            className="outline outline-[#191538] p-1 rounded-md"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="categorize">Categorize</option>
            <option value="cloze">Cloze</option>
            <option value="comprehension">Comprehension</option>
          </select>
        </label>

        {type === "categorize" ? (
          <Categroirze
            onSave={onSave}
            initialData={initialData ?? emptyQuestion}
          />
        ) : type === "cloze" ? (
          <Cloze
            onSave={onSave}
            initialData={initialData ?? emptyQuestion}
            isMobile={isMobile}
          />
        ) : (
          type === "comprehension" && (
            <Comprehension
              onSave={onSave}
              initialData={initialData ?? emptyQuestion}
            />
          )
        )}
      </div>
    </div>
  );
}
