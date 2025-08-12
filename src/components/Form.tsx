"use client";
import { FormData } from "@/app/create-form/action";
import { singleForm } from "@/app/Your-form/action";
import { QuestionsClient } from "@/types/ApiTypes";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import FormRender from "./FormRender";
interface Props {
  id: string;
}
interface dataProps {
  formDetails :FormData,
  questions:QuestionsClient[]
}

const Form = ({ id }: Props) => {
  const { data } = useQuery<dataProps>({
    queryKey: ["single-form", id],
    queryFn: () => singleForm(id),
  });
  console.log(data);

  if (!data) return <div>no </div>;
  return <FormRender questions={data.questions} formId={id}  formDetails={data.formDetails}/>
};

export default Form;
