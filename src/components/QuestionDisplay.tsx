import React from 'react';
import { QuestionsClient } from '@/types/ApiTypes';
import Image from 'next/image';

interface QuestionDisplayProps {
  question: QuestionsClient;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div  className='border p-2 mt-2'>
      <h3>Type: {question.type}</h3>
      <p><strong>Question:</strong> {question.questionText}</p>
      {question.imageUrl && <Image src={question.imageUrl} alt="question" width={60} height={40}  className='mb-3'/> }

      {question.type === 'categorize' && question.categorizeOptions && (
        <div>
          <p><strong>Categorize Items:</strong> {question.categorizeOptions.items.join(', ')}</p>
          <p><strong>Belongs To:</strong> {question.categorizeOptions.Belongs.join(', ')}</p>
          <p><strong>Answers:</strong></p>
          <ul>
            {question.categorizeOptions.asnwer.map((a, i) => (
              <li key={i}>{a.text} belongs to {a.belongs}</li>
            ))}
          </ul>
        </div>
      )}

      {question.type === 'cloze' && question.blanks && (
        <div>
          <p><strong>Options:</strong> {question.blanks.option.join(', ')}</p>
          <p><strong>Answers:</strong></p>
          <ul>
            {question.blanks.answer.map((a, i) => (
              <li key={i}>Position {a.position}: {a.text}</li>
            ))}
          </ul>
        </div>
      )}

      {question.type === 'comprehension' && question.paraGraph && (
        <div>
          <p><strong>Paragraph:</strong> {question.paraGraph.para}</p>
          {question.paraGraph.subQuestions && question.paraGraph.subQuestions.length > 0 && (
            <>
              <p><strong>Sub Questions:</strong></p>
              <ul>
                {question.paraGraph.subQuestions.map((sq, i) => (
                  <li key={i}>
                    <p>{sq.questionText}</p>
                    {sq.options && <p>Options: {sq.options.join(', ')}</p>}
                    <p>Correct Answer: {sq.correctAnswer}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {question.options && question.options.length > 0 && (
        <p><strong>Options:</strong> {question.options.join(', ')}</p>
      )}
    </div>
  );
}
