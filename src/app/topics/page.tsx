import TopicCard from "@/components/TopicCard";
import React from "react";

export default function page() {
  const topics: Array<string> = [
    "Algebra",
    "Geometry",
    "English",
    "Science",
    "History",
    "Geography",
    "Art",
    "Music",
    "Computer science",
    "Economics",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
  ];
  return (
    <div className="w-full min-h-screen">
      <h1 className="text-4xl my-9 w-fit mx-auto font-bold tracking-wider">
        Topics
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 p-7">
        {topics.map((t) => (
          <TopicCard title={t} />
        ))}
      </div>
    </div>
  );
}
