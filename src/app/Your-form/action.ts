export const GetAllForms = async () => {
  const res = await fetch("/api/getAllForm", {
    method: "GET",
    cache: "no-store" // prevents stale data in Next.js
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data; // return the parsed data
};
