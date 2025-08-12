export const userDetails = async () => {
  const res = await fetch("/api/user-details", {
    method: "GET",
  });

  const data = await res.json();
  return data;
};
