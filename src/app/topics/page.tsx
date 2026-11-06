"use client";

import TopicCard from "@/components/TopicCard";
import React from "react";
import { useEffect, useState } from "react";
import ITopic from "@/app/interfaces/ITopic";
import axios from "axios";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Page() {
  // undefined while loading
  const [topics, setTopics] = useState<Array<ITopic>>();
  useEffect(() => {
    axios
      .get("/api/topics")
      .then((res) => {
        const data = res.data;
        setTopics(data);
      })
      .catch((err) => {
        console.log(err);
        // stop the loading animation instead of spinning forever
        setTopics([]);
      });
  }, []);


  return (
    <div>
      {!topics ? (
      <div className="w-full h-screen flex flex-col items-center pt-11">
        <LoadingAnimation/>
      </div>
      ) : (
      <div className="w-full min-h-screen">
      <h1 className="text-4xl my-9 w-fit mx-auto font-bold tracking-wider animate-fade-in-up">
        Topics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-7 p-4 sm:p-7">
      {topics.map((t, i) => <TopicCard title={t.title} key={t.id} topic={t} index={i} />)}
      </div>
    </div>)

      }
    </div>
  );
}
