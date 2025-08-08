import { QuestionsClient } from "@/types/ApiTypes";
import { QueryClient } from "@tanstack/react-query";


interface FormData {
  title: string;
  theme: { bg: string; color: string };
  questions: QuestionsClient[]; 
}
export const createForm = async ({ title, questions, theme }: FormData) => {
  const res = await fetch("/api/create-from", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, questions, theme }),
  });
  await res.json();
};
