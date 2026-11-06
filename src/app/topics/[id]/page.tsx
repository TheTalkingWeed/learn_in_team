"use client";

import ITopic from "@/app/interfaces/ITopic";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import IQuestion from "../../../../functions/src/interfaces/IQuestion";
import QuestionCard from "@/components/QuestionCard";
export default function Page() {
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [topic, setTopic] = useState<ITopic>({} as ITopic);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const topicId = params?.id;
  useEffect(() => {
    Promise.all([
      axios.get(`/api/topics/${topicId}`),
      axios.get(`/api/questions_by_topic/${topicId}`),
    ])
      .then(([topicRes, questionsRes]) => {
        setTopic(topicRes.data);
        setQuestions(questionsRes.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [topicId]);

  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col px-4 py-8 sm:py-14 gap-y-5 items-center">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-center wrap-break-word animate-fade-in-up">{topic.title}</h1>
          {questions.length > 0 ? (
            questions.map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)
          ) : (
            <h1>No questions</h1>
          )}
        </>
      )}
    </div>
  );
}
