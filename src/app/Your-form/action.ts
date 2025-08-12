import { StudentAnswer } from "@/types/ApiTypes";

interface SubmissionProps {
  formId: string;
  answers: StudentAnswer[];
}
export const GetAllForms = async () => {
  const res = await fetch("/api/getAllForm", {
    method: "GET",
    cache: "no-store", //
  });

  if (!res.ok || res.status !== 200) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

export const singleForm = async (id: string) => {
  const res = await fetch(`/api/get-formdetails?id=${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok || res.status !== 200) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};
export const deleteForm = async (id: string) => {
  const res = await fetch(`/api/delete-form?id=${id}`, {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok || res.status !== 200) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

export const submitAnswer = async ({ formId, answers }: SubmissionProps) => {
  try {
    const res = await fetch("/api/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId, answers }),
    });
    await res.json();
  } catch (error) {
    throw new Error("Server Issue" + error);
  }
};
