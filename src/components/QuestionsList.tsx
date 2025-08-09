import { QuestionsClient } from '@/types/ApiTypes';
import React from 'react';


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
          <li key={i} className='cursor-pointer mb-3' onClick={() => onSelect(i)}>
            <strong>{q.type.toUpperCase()}</strong>: {q.questionText.slice(0, 40)}...
          </li>
        ))}
      </ul>
    </div>
  );
}
