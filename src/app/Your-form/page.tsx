"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteForm, GetAllForms } from "./action";
import { FormData } from "../create-form/action";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { toast } from "sonner";

interface DataType {
  forms: FormData[];
  message: string;
}

const Page = () => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery<DataType>({
    queryKey: ["fetch-all-forms"],
    queryFn: GetAllForms,
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-form"],
    mutationFn: deleteForm,
    onSuccess: () => {
      toast("Form Deleted");
      queryClient.invalidateQueries({ queryKey: ["fetch-all-forms"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error deleting form", error);
      }
    },
  });

  if (isPending) {
    return <h1>Loading.....</h1>;
  }

  if (!data || !Array.isArray(data.forms) || data.forms.length === 0) {
    return (
      <div className="mx-auto flex flex-col items-center gap-2 my-10 text-xl">
        <span>No Data Found</span>
        <Link href="/create-form" className="text-blue-500 underline">
          Create One
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 items-center">
      {data?.forms.map((form) => (
        <Link
          key={form._id}
          href={`/form/${form._id}`}
          className="relative border p-2 rounded-xl w-full hover:bg-zinc-100 z-0"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold">{form.title}</h1>
            {form.headerImage && (
              <Image
                src={form.headerImage}
                alt="image"
                height={60}
                width={60}
                className="rounded-lg"
              />
            )}
          </div>

          <span>{form.questions.length}</span>
          <Button
            type="button"
            variant="destructive"
            className="absolute top-4 right-10 z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteMutation.mutate(form._id!);
            }}
          >
            <Delete className="size-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default Page;
