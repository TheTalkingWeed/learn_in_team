"use client";

import TopicCard from "@/components/TopicCard";
import React from "react";
import { useEffect, useState } from "react";
import ITopic from "@/app/interfaces/ITopic";
import axios from "axios";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function page() {
  const [topics, setTopics] = useState<Array<ITopic>>();
  const [loading,setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true)
    axios
      .get("/api/topics")
      .then((res) => {
        const data = res.data;
        setTopics(data);
      })
      .catch((err) => console.log(err));
      setLoading(false)
  }, []);


  return (
    <div>
      {!topics ? (
      <div className="w-full h-screen flex flex-col items-center pt-11">
        <LoadingAnimation/>
      </div>
      ) : (
      <div className="w-full min-h-screen">
      <h1 className="text-4xl my-9 w-fit mx-auto font-bold tracking-wider">
        Topics
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 p-7">
      {topics.map((t) => <TopicCard title={t.title} key={t.id} topic={t} />)}
      </div>
    </div>)

      }
    </div>
  );
}
