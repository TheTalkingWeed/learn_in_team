"use client";

import ITopic from "@/app/interfaces/ITopic";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import IQuestion from "../../../../functions/src/interfaces/IQuestion";
import QuestionCard from "@/components/QuestionCard";
import IUser from "../../../../functions/src/interfaces/IUser";
import { get } from "http";

export default function Page() {
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [topic, setTopic] = useState<ITopic>({} as ITopic);
  const [loading, setLoading] = useState<boolean>(false);
  const [users,setUsers] = useState<Array<IUser>>([]);
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/topics/${params?.id}`)
      .then((res) => {
        const data = res.data;
        setTopic(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`/api/questions_by_topic/${params?.id}`)
      .then((res) => {
        const data = res.data;
        setQuestions(data);
      })
      .catch((err) => console.log(err))

      axios.get(`/api/users`)
      .then((res) => {
        const data = res.data;
        setUsers(data);
      })
      .catch((err) => console.log(err)).
      finally(() => setLoading(false));
  }, []);

  function getThePostedUser(question: IQuestion): IUser  | undefined{
    let user : IUser | undefined= {} as IUser;
    user = users.find((u) => u.id === question.posted_user_id.toString());
console.log(user);
    return user
  }
  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col py-14 gap-y-5 items-center">
      {loading ? (
        <h1>Loading...</h1>
      ) : questions ? (
        <>
          <h1 className="text-4xl font-bold tracking-wider">{topic.title}</h1>
          {questions.map((q) => (
            <QuestionCard question={q} user={getThePostedUser(q)}/>
          ))}
        </>
      ) : (
        <h1>No questions</h1>
      )}
    </div>
  );
}
