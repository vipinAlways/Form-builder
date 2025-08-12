"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GetAllForms } from "./action";
import { QuestionsClient } from "@/types/ApiTypes";
import { FormData } from "../create-form/action";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

interface dataType {
  forms: FormData[];
  message: string;
}

const page = () => {
  const { data, isPending } = useQuery<dataType>({
    queryKey: ["fetch-all-forms"],
    queryFn: GetAllForms,
  });

  console.log(data);
  if (isPending || !data || !data.forms) return <h1>Loading.....</h1>;
  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 items-center">
      {data.forms.map((form) => (
        <Link
          key={form._id}
          href={`/form/${form._id}`}
          className="relative border p-2 rounded-xl w-full hover:bg-zin z-0"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold ">{form.title}</h1>

            {form.headerImage && (
              <div>
                <Image
                  src={form.headerImage}
                  alt="image"
                  height={60}
                  width={60}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          <span>{form.questions.length}</span>
          <Button
            className="absolute top-4 right-10 z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Delete clicked:", form._id);
            }}
          >
            <Delete className="size-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default page;
