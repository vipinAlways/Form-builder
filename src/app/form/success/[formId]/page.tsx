import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-1.5 border-2 rounded-lg p-3">
        <h1 className="text-xl">You have Submitted Form Successfully</h1>
        <h3 className="text-xl">Thank you For Your Time</h3>
        <Link href={"/"} className="p-2 rounded-lg bg-green-500 text-zinc-200">
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default page;
