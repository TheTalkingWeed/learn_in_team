"use client";


import React, { useEffect,useRef } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import IQuestion from "../../functions/src/interfaces/IQuestion";
import axios from "axios";
import { useState } from 'react';
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";



export default function QuestionCard(props: any) {
  const toast = useRef<Toast>(null);

  const questionid : number =  props.questionid;
  const user :IUser= props.user
  const [question, setQuestion] = useState<IQuestion>(props.question);
  const [upVotedByUser, setUpVotedByUser] = useState<boolean>(false);
  const [downVotedByUser, setDownVotedByUser] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [upvoteNumber, setUpvoteNumber] = useState<number>();
  const [loading, setLoading] = useState<boolean>();
  const [voteText,setVoteText] = useState<string>();
  function refreshComponent() {
    setRefreshKey(prevKey => prevKey + 1);
  }
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
    if(question.up_voted_by.includes(user.id)) setUpVotedByUser(true)
  },[])
  


  function handleDownVote(userId: string) {
    // Check if the user has already downvoted the question
    if (question.down_voted_by.includes(userId)) {
      // If yes, update the state by removing the user ID from the down_voted_by array
      setQuestion(prevQuestion => ({
        ...prevQuestion,
        down_voted_by: prevQuestion.down_voted_by.filter(id => id !== userId),
      }));
    } else {
      // If not, check if the user has upvoted the question
      if (question.up_voted_by.includes(userId)) {
        // If yes, remove the upvote before adding the downvote
        setQuestion(prevQuestion => ({
          ...prevQuestion,
          up_voted_by: prevQuestion.up_voted_by.filter(id => id !== userId),
          down_voted_by: [...prevQuestion.down_voted_by, userId],
        }));
      } else {
        // If not, update the state by adding the user ID to the down_voted_by array
        setQuestion(prevQuestion => ({
          ...prevQuestion,
          down_voted_by: [...prevQuestion.down_voted_by, userId],
        }));
      }
    }
  }
  function handleUpVote(userId: string) {
    // Check if the user has already upvoted the question
    if (question.up_voted_by.includes(userId)) {
      // If yes, update the state by removing the user ID from the up_voted_by array
      setQuestion(prevQuestion => ({
        ...prevQuestion,
        up_voted_by: prevQuestion.up_voted_by.filter(id => id !== userId),
      }));
    } else {
      // If not, check if the user has downvoted the question
      if (question.down_voted_by.includes(userId)) {
        // If yes, remove the downvote before adding the upvote
        setQuestion(prevQuestion => ({
          ...prevQuestion,
          down_voted_by: prevQuestion.down_voted_by.filter(id => id !== userId),
          up_voted_by: [...prevQuestion.up_voted_by, userId],
        }));
      } else {
        // If not, update the state by adding the user ID to the up_voted_by array
        setQuestion(prevQuestion => ({
          ...prevQuestion,
          up_voted_by: [...prevQuestion.up_voted_by, userId],
        }));
      }
    }
  }
 
 
  useEffect(() => {
    setDownVotedByUser(false);
    setUpVotedByUser(true)

    axios.put("/api/questions/"+ question.id,{
      id: question.id,
      text: question.text,
      title: question.title,
      topic_id: question.topic_id,
      posted_user_id: question.posted_user_id,
      posted_time: question.posted_time,
      up_voted_by: question.up_voted_by,
      down_voted_by: question.down_voted_by,
  })
  refreshComponent();
  },[
    question.up_voted_by
  ])

  useEffect(() => {
    setUpVotedByUser(false)
    setDownVotedByUser(true);

    axios.put("/api/questions/"+ question.id,{
      id: question.id,
      text: question.text,
      title: question.title,
      topic_id: question.topic_id,
      posted_user_id: question.posted_user_id,
      posted_time: question.posted_time,
      up_voted_by: question.up_voted_by,
      down_voted_by: question.down_voted_by,
    })

  refreshComponent();
  },[
      question.down_voted_by
  ])
 
  useEffect(() => {
    if(question.up_voted_by.includes(user.id)){
      showMess("You successfully upvoted this post!")
      setVoteText("You upvoted this post")
    } else if (question.down_voted_by.includes(user.id)){
      showMess("You successfully downvoted this post!")
      setVoteText("You downvoted this post")
    } else setVoteText("")
  },[question.up_voted_by,question.down_voted_by])
  


  
  

 

  return (
    <div className="w-[80%] flex flex-col bg-slate-300 h-fit p-5 gap-y-4">
      {
        loading ? (<Skeleton width="100%"></Skeleton>) : (
        <>
          <div className="flex flex-row gap-x-6 items-center">
            <div className="flex flex-col items-center justify-center gap-y-3">
              <div className="flex flex-col text-center">
                <span >{question.up_voted_by.length}</span>
                <i className={`pi pi-chevron-up cursor-pointer`} onClick={(e) => handleUpVote(user.id)}/>
              </div> 
                <div className="flex flex-col text-center">
                  <i className="pi pi-chevron-down cursor-pointer" onClick={(e) => handleDownVote(user.id)}/>
                <span >{question.down_voted_by.length}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="font-bold text-2xl text-left">{question.title}</h1>
                <p>by {user.username}</p>

              </div>
              <div className="ml-auto">{voteText}</div>
          </div>
          <div className="w-full bg-slate-200 p-5">{question.text}</div>
        </>
        )
        }
        </div>
  );
}
