interface SubmissionProps {
  formId: string;
  answers: any;
}
export const GetAllForms = async () => {
  const res = await fetch("/api/getAllForm", {
    method: "GET",
    cache: "no-store", //
  });

  if (!res.ok) {
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

  if (!res.ok) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

export const submitAnswer = async ({ formId, answers }: SubmissionProps) => {
  const res = await fetch("/api/submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formId, answers }),
  });
  await res.json();
};
