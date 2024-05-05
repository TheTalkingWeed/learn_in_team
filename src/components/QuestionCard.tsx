"use client";


import React, { useEffect,useRef } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import IQuestion from "../../functions/src/interfaces/IQuestion";
import IAnswer from "../../functions/src/interfaces/IAnswer";
import axios from "axios";
import { useState } from 'react';
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Answer from "../components/Answer"
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { useRouter } from 'next/navigation';

export default function QuestionCard(props: any) {
  const router = useRouter()


  const toast = useRef<Toast>(null);

  const questionid : number =  props.questionid;
  const user :IUser= props.user
  const [question, setQuestion] = useState<IQuestion>(props.question);
  const [answersForQuestion, setAnswersForQuestion] = useState<Array<IAnswer>>([]);
  const [allAnswers, setAllAnswers] = useState<Array<IAnswer>>([]);
  const [loading, setLoading] = useState<boolean>();
  const [voteText,setVoteText] = useState<string>();
  const [answerFormVisible,setAnswerFormVisible] = useState<boolean>(false);
  const [answerText,setAnswerText] = useState<string>("");



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
    setLoading(true)
    
    axios.get("/api/answers/" + props.question.id).then((res) => {
      const data = res.data;
      setAnswersForQuestion(data)
    })
    .catch((err) => {
      showError("Can't get answers")
    })
      axios.get("/api/answers").then((res) => {
        const data = res.data;
        setAllAnswers(data)
      })
      .catch((err) => {
        showError("Can't get answers")
      }).finally(() => 
        setLoading(false)
      )
  },[,answerFormVisible])
  


  function handleDownVote(userId: string) {
    if (user){
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

    }else if (!user){
      showMess("You must be logged in to downvote!")
    }
  }
  function handleUpVote(userId: string) {
    if(user){

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
    }else if(!user){
      showMess("You must be logged in to upvote!")

    }
  }

  function generateAId(): number {
    return allAnswers.length + 1
  }
  
  function toggleAnswerFormVisible(){
    setAnswerFormVisible(!answerFormVisible);
  }
  
  async function postAnswer(){
    
    if (user){
      

      await axios.post("/api/answers",{
        id: generateAId() ,
        text: answerText,
        question_id: question.id,
        answered_user_id: user.id,
        answered_date: new Date(),
        approved: false,
        up_voted_by: [],
        down_voted_by: [],
      }
    ).then((res) => {

        showMess("Answer posted succseffuly!")
      }).catch((err) => {
        console.log(err)
        showError("Error while uploading your answer!")
      })

      setAnswerText("")
      setAnswerFormVisible(false)
    }
  }


  
  useEffect(() => {

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
  },[
    question.up_voted_by
  ])

  useEffect(() => {

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
        <div>

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
          <div className="w-full flex py-5">
            <Button label="Write an answer" className=" ml-auto" onClick={toggleAnswerFormVisible}></Button>
          </div>
            <div className="flex flex-col">
            {
              allAnswers ? (
                allAnswers.filter((e) => e.question_id == question.id)
                .slice().sort((a, b) =>   new Date(b.answered_date).getTime() - new Date(a.answered_date).getTime())
                .map((a) => <Answer answer={a}/>)
              
              ) :<></>
            }
            </div>
            {answerFormVisible ? <div className="flex flex-col gap-y-6 w-full">
              <InputTextarea value={answerText} autoResize={true} onChange={
                (e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)} rows={5} />
              <Button onClick={() => postAnswer()} label="Submit answer" className="w-fit mx-auto"></Button>
            </div> : <></>}
        </div>
        </>
        )
        }
        </div>
  );
}
