"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FormData } from "./create-form/action";
import { userDetails } from "./actions/user.action";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Details {
  user: {
    name: string;
    email: string;
  };
  createdForms: FormData[];
  SubmittedForms: FormData[];
}
const Page = () => {
  const { data, isPending } = useQuery<Details>({
    queryKey: ["user-details"],
    queryFn: userDetails,
  });
  

  if (isPending) return <Loader2 className="animate-spin size-6" />;
  return (
    <div className="p-4 h-full">
      <div className="flex items-start flex-col gap-10 md:gap-14 h-full">
        <div className="font-semibold sm:text-5xl flex gap-4 flex-col">
          <h1 className="sm:text-5xl font-bold">Hello,</h1>
          <h1 className="flex flex-col gap-1">
            {data?.user?.name} <p>Enjoy Your Day</p>
          </h1>
        </div>

        <div className="justify-around w-full gap-5 flex ">
          <div className="flex flex-col gap-1.5  w-96 border p-2 rounded-lg ">
            <h1 className="border-b text-xl font-semibold">Created Forms</h1>
            <ul className="h-48 overflow-y-auto p-1.5">
              {data?.createdForms.map((form) => (
                <li key={form._id} className="border-b">
                  <Link href={`/form/${form._id}`}>
                    <span className="text-lg">{form.title}</span>
                  
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5  w-96 border p-2 rounded-lg ">
            <h1 className="border-b text-xl font-semibold">Created Forms</h1>
            <ul className="h-48 overflow-y-auto p-1.5">
              {data?.SubmittedForms.map((form) => (
                <li key={form._id} className="border-b">
                  <Link href={`/form/${form._id}`}>
                    <span className="text-lg">{form.title}</span>
                    {/* <p>{form.description}</p> */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Page;
