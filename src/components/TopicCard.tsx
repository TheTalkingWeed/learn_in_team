"use client";

import React from "react";
import Link from "next/link";
export default function TopicCard(props: any) {
  return (
    <Link
      href={{
        pathname: "/topics/[topicname]",
        query: { topicname: props.title },
      }}
      as={`/topics/${props.title}`}
      className="w-full h-36 text-3xl font-bold bg-purple-100 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:-translate-y-2 duration-300 hover:bg-purple-200"
    >
      {props.title}
    </Link>
  );
}
