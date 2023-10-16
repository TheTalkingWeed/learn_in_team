"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function page(props: any) {
  const params = useParams();
  const { topicname } = params;
  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col justify-center items-center">
      <h1 className="text-7xl font-bold">{topicname}</h1>
    </div>
  );
}
