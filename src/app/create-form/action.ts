import { QuestionsClient } from "@/types/ApiTypes";

export interface FormData {
  _id?: string;
  title: string;
  theme: { bg: string; color: string };
  questions: QuestionsClient[];
  headerImage?: string;
}
export const createForm = async ({
  title,
  questions,
  theme,
  headerImage,
}: FormData) => {
  const res = await fetch("/api/createForm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, questions, theme, headerImage }),
  });
  await res.json();
};
