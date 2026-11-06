"use client";


import React, { useEffect,useRef } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import UserTitleBadge from "./UserTitleBadge";
import IQuestion from "../../functions/src/interfaces/IQuestion";
import IAnswer from "../../functions/src/interfaces/IAnswer";
import axios from "axios";
import { useState } from 'react';
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Answer from "../components/Answer"
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Avatar } from 'primereact/avatar';
import { UserAuth } from "@/app/context/AuthContext";
import ITopic from "@/app/interfaces/ITopic";
import Link from "next/link";

function fetchAnswers(): Promise<Array<IAnswer>> {
  return axios.get("/api/answers").then((res) => res.data)
}

// index staggers the entrance animation when several cards are listed,
// topic is shown on the card where the page itself doesn't say it (e.g. search results)
export default function QuestionCard(props: { question: IQuestion; index?: number; topic?: ITopic }) {
  const toast = useRef<Toast>(null);
  const [postedUser,SetPostedUser] = useState<IUser>();
  const question = props.question;
  const [allAnswers, setAllAnswers] = useState<Array<IAnswer>>([]); // az adott kérdéshez a válaszok
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);
  const [answerFormVisible,setAnswerFormVisible] = useState<boolean>(false);
  const [answerText,setAnswerText] = useState<string>("");
  const [showAnswers,setShowAsnwers] = useState<boolean>(false);
  const { user} = UserAuth();
  const months = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];


  const showError = (mess: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mess,
      life: 3000,
    });
  };

  const showMess = (mess: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: mess,
      life: 3000,
    });
  };
  
  useEffect(() => {
    axios.get(`/api/users/${question.posted_user_id}`).then((res) => {
      const data = res.data;
      SetPostedUser(data);
    }).catch(() =>{
      showError("Can't get user.");
    })
  },[question.posted_user_id])

  function loadAnswers() {
    return fetchAnswers().then((answers) => {
      setAllAnswers(answers)
    })
    .catch(() => {
      showError("Can't get answers")
    })
  }

  useEffect(() => {
    fetchAnswers().then((answers) => {
      setAllAnswers(answers)
    })
    .catch(() => {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Can't get answers", life: 3000 })
    }).finally(() =>
      setLoading(false)
    )
  },[])

  // one more than the biggest id, so ids stay unique even after answers were deleted
  function generateAId(): number {
    return allAnswers.reduce((max, a) => Math.max(max, Number(a.id) || 0), 0) + 1
  }

  function toggleAnswerFormVisible(){
    setAnswerFormVisible(!answerFormVisible);
  }
  function toggleAnswersVisible(){
    setShowAsnwers(!showAnswers);
  }



  async function postAnswer(){
    const text = answerText.trim();
    if (!user || !text || posting) return;
    setPosting(true);
    try {
      await axios.post("/api/answers",{
        id: generateAId() ,
        text: text,
        question_id: question.id,
        answered_user_id: user.uid,
        answered_date: new Date(),
        approved: false,
        up_voted_by: [],
        down_voted_by: [],
      })
      showMess("Answer posted successfully!")
      // only clear the form when it worked, so a failed answer isn't lost
      setAnswerText("")
      setAnswerFormVisible(false)
      setShowAsnwers(true)
      await loadAnswers()
    } catch (err) {
      console.log(err)
      showError("Error while uploading your answer!")
    } finally {
      setPosting(false)
    }
  }

  function getYMDForQuestion(){
    const date : Date = new Date(question.posted_time)
    
    return date.getFullYear() + ". " + months[date.getMonth()] + " " + date.getDate() +"."
  }

  const questionAnswers = allAnswers
    .filter((e) => e.question_id == question.id)
    .sort((a, b) => new Date(b.answered_date).getTime() - new Date(a.answered_date).getTime());

  const initials = postedUser
    ? `${postedUser.first_name?.[0] ?? ""}${postedUser.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div
      className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up transition-shadow duration-300 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(props.index ?? 0, 8) * 80}ms` }}
    >
      <Toast ref={toast} />
      <div className="h-2 bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400" />
      {
        loading ? (
          <div className="flex flex-col gap-3 p-8">
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="30%" />
            <Skeleton height="5rem" />
          </div>
        ) : (
        <div className="flex flex-col gap-5 p-4 sm:p-8">
          <div className="flex flex-row flex-wrap items-start justify-between gap-4">
            <div className="flex flex-row items-center gap-3 sm:gap-4 min-w-0">
              <Avatar
                image={postedUser?.profile_picture || undefined}
                label={postedUser?.profile_picture ? undefined : initials}
                shape="circle"
                size="large"
                className="bg-purple-200! text-purple-700! ring-2 ring-purple-100"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 wrap-break-word">{question.title}</h1>
                {postedUser && (
                  <span className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1 text-gray-500">
                    <span>
                      {postedUser.first_name} {postedUser.last_name} · @{postedUser.username}
                    </span>
                    <UserTitleBadge title={postedUser.title} />
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-2 mt-1">
              {props.topic && (
                <Link
                  href={`/topics/${props.topic.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  title={`Open the ${props.topic.title} topic`}
                >
                  <i className="pi pi-tag" style={{ fontSize: "0.75rem" }} />
                  {props.topic.title}
                </Link>
              )}
              <span className="text-sm text-gray-500">
                <i className="pi pi-calendar mr-1" style={{ fontSize: "0.8rem" }} />
                {getYMDForQuestion()}
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word bg-purple-50 rounded-xl p-4 sm:p-5">
            {question.text}
          </p>

          <div className="flex flex-row flex-wrap items-center justify-between gap-3">
            <div className="flex flex-row gap-5 text-sm text-gray-500">
              <span>
                <i className="pi pi-comments mr-1" style={{ fontSize: "0.8rem" }} />
                {questionAnswers.length} {questionAnswers.length === 1 ? "answer" : "answers"}
              </span>
            </div>
            <div className="flex flex-row gap-2">
              {user && (
                <Button
                  label="Write an answer"
                  icon="pi pi-pencil"
                  outlined
                  onClick={toggleAnswerFormVisible}
                />
              )}
              <Button
                label={showAnswers ? "Hide answers" : "Show answers"}
                icon={showAnswers ? "pi pi-chevron-up" : "pi pi-chevron-down"}
                iconPos="right"
                text
                onClick={toggleAnswersVisible}
              />
            </div>
          </div>

          {answerFormVisible && (
            <div className="flex flex-col gap-3 border border-gray-200 rounded-xl p-5 animate-fade-in-up [animation-duration:0.3s]">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Your answer
              </label>
              <InputTextarea
                value={answerText}
                autoResize={true}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)}
                rows={5}
                placeholder="Write your answer..."
              />
              <div className="flex flex-row justify-end gap-2">
                <Button label="Cancel" text onClick={toggleAnswerFormVisible} />
                <Button
                  label="Submit answer"
                  icon="pi pi-check"
                  loading={posting}
                  disabled={!answerText.trim()}
                  onClick={() => postAnswer()}
                />
              </div>
            </div>
          )}

          {showAnswers && (
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800">Answers</h2>
              {questionAnswers.length > 0 ? (
                questionAnswers.map((a, i) => (
                  <Answer key={a.id} answer={a} questionOwnerId={question.posted_user_id} index={i} />
                ))
              ) : (
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              )}
            </div>
          )}
        </div>
        )
      }
    </div>
  );
}