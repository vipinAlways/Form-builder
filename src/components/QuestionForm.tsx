import { emptyQuestion, QuestionsClient } from "@/types/ApiTypes";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Categroirze from "./Categroirze";
import Cloze from "./Cloze";
import Comprehension from "./Comprehension";

export interface QuestiondivProps {
  initialData?: QuestionsClient;
  onSave: (question: QuestionsClient) => void;
}

export function QuestionForm({ initialData, onSave }: QuestiondivProps) {
  const [newBelongs, setNewBelongs] = useState<string>("");
  const [type, setTypes] = useState<string>("");
  const [questionText, setQuestionText] = useState(
    initialData?.questionText || ""
  );

  const [newItem, setNewItem] = useState<string>("");
  const [asnwerBlongs, setAsnwerBlongs] = useState<string>("");

  const [questionData, setQuestionData] =
    useState<QuestionsClient>(emptyQuestion);

  return (
    <div className="border  flex flex-col  gap-4">
      <div className="w-full flex  md:text-lg text-sm flex-col max-md:items-start font-semibold gap-3 p-2">
        <label htmlFor="Questiontype">
          Type:
          <select
            id="Questiontype"
            value={type}
            onChange={(e) => setTypes(e.target.value)}
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
          <Cloze onSave={onSave} initialData={initialData ?? emptyQuestion}/>
        ) : (
           type === "comprehension"  && <Comprehension onSave={onSave} initialData={initialData ?? emptyQuestion}/>
        )}
      </div>
    </div>
  );
}
