"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GetAllForms } from "./action";
import { QuestionsClient } from "@/types/ApiTypes";
import { FormData } from "../create-form/action";
import { FormSchema } from "@/types/SchemaTypes";

const page = () => {
  const { data, isPending } = useQuery({
    queryKey: ["fetch-all-forms"],
    queryFn: GetAllForms,
  });

  if (isPending || !data) return <h1>Loading.....</h1>;
  return (
    <div>
      {data.forms.map(({ form }: { form: FormData }) => (
        <h1 key={form._id}>{form.title}</h1>
      ))}
    </div>
  );
};

export default page;
