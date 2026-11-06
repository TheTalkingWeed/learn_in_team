"use client";

import React from "react";
import Link from "next/link";
import ITopic from "@/app/interfaces/ITopic";
// index staggers the entrance animation, so the cards appear one after another
export default function TopicCard(props: { topic: ITopic; title?: string; index?: number }) {
  return (
    <Link
      href={{
        pathname: `/topics/${props.topic.id}`,
        query: {
          id: props.topic.id,
        },
      }}
      as={`/topics/${props.topic.id}`}
      style={{ animationDelay: `${(props.index ?? 0) * 70}ms` }}
      className="w-full h-28 sm:h-36 px-3 text-center wrap-break-word text-2xl sm:text-3xl font-bold bg-purple-100 rounded-lg flex flex-col justify-center items-center cursor-pointer animate-fade-in-up transition-all hover:-translate-y-2 duration-300 hover:bg-purple-200 hover:shadow-lg hover:shadow-purple-200"
    >
      {props.topic.title}
    </Link>
  );
}
