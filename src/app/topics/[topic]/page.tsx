"use client";

import ITopic from "@/app/interfaces/ITopic";
import React, { useState } from "react";
import { useEffect } from "react";

export default function Page({
  params,
}: {
  params: {
    id: number;
    title: string;
  };
}) {
  const [topic, setTopic] = useState<ITopic>({
    id: params.id,
    title: params.title,
  });
  useEffect(() => {}, []);
  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col justify-center items-center">
      {topic ? (
        <h1 className="text-7xl font-bold">{topic.title}</h1>
      ) : (
        <h1 className="text-7xl font-bold">No topic found</h1>
      )}
    </div>
  );
}
