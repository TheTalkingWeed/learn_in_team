"use client";

import TopicCard from "@/components/TopicCard";
import React from "react";
import { useEffect, useState } from "react";
import ITopic from "@/app/interfaces/ITopic";
import axios from "axios";

export default function page() {
  const [topics, setTopics] = useState<Array<ITopic>>();
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5001/cooplearn-auth/us-central1/app/api/topics")
      .then((res) => {
        const data = res.data;
        setTopics(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="w-full min-h-screen">
      <h1 className="text-4xl my-9 w-fit mx-auto font-bold tracking-wider">
        Topics
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 p-7">
        {!topics ? (
          <>No topics</>
        ) : (
          topics.map((t) => <TopicCard title={t.title} key={t.id} topic={t} />)
        )}
      </div>
    </div>
  );
}
