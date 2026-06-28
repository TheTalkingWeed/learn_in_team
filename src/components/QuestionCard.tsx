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
import { UserAuth } from "@/app/context/AuthContext";

export default function QuestionCard(props: any) {
  const router = useRouter()
  const toast = useRef<Toast>(null);
  const [postedUser,SetPostedUser] = useState<IUser>();
  const [question, setQuestion] = useState<IQuestion>(props.question);
  const [allAnswers, setAllAnswers] = useState<Array<IAnswer>>([]); // az adott kérdéshez a válaszok
  const [loading, setLoading] = useState<boolean>();
  const [answerFormVisible,setAnswerFormVisible] = useState<boolean>(false);
  const [answerText,setAnswerText] = useState<string>("");
  const [showAnswers,setShowAsnwers] = useState<boolean>(false);
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
    axios.get("api/users/" + question.posted_user_id).then((res) => {
      const data = res.data;
      SetPostedUser(data);
    }).catch((err) =>{
      showError("Can't get user.");
    })
  },[])

  useEffect(() => {
    setLoading(true)
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
  
  function generateAId(): number {
    return allAnswers.length + 1
  }
  
  function toggleAnswerFormVisible(){
    setAnswerFormVisible(!answerFormVisible);
  }
  function toggleAnswersVisible(){
    setShowAsnwers(!showAnswers);
  }
  


  async function postAnswer(){
    if (postedUser){
      await axios.post("/api/answers",{
        id: generateAId() ,
        text: answerText,
        question_id: question.id,
        answered_user_id: postedUser.id,
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

  function getYMDForQuestion(){
    let date : Date = new Date(question.posted_time)
    
    return date.getFullYear() + ". " + months[date.getMonth()] + " " + date.getDate() +"."
  }

  return (
    <div className="w-[80%] flex flex-col bg-slate-300 h-fit p-5 gap-y-4 rounded-lg">
      {
        loading ? (<Skeleton width="100%"></Skeleton>) : (
        <>
        <div className="flex flex-col">

          <div className="flex flex-row gap-x-6 items-center justify-between px-5 py-4">
              <div className="flex flex-col">
                <h1 className="font-bold text-2xl text-left">{question.title}</h1>
                {
                  postedUser
                   ?
                    <p>by {postedUser.username}</p>
                    : 
                    <></>
                }
              </div>
              <div className="self-end font-bold ">
                <span className="font-normal">Posted time:</span> {getYMDForQuestion()}
              </div>
          </div>
          <div className="w-full bg-slate-200 p-5 rounded-lg">{question.text}</div>
          <div className="w-fit flex gap-5 flex-row py-5 self-end">
            <Button label="Write an answer" className=" ml-auto" onClick={toggleAnswerFormVisible}></Button>
            <Button label={showAnswers ? "Hide answers" : "Show answers"} className=" ml-auto" onClick={toggleAnswersVisible}></Button>
          </div>
            <div className="flex flex-col">
              {answerFormVisible ? <div className="flex flex-col gap-y-6 w-full">
                <InputTextarea value={answerText} autoResize={true} onChange={
                  (e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)} rows={5} />
                <Button onClick={() => postAnswer()} label="Submit answer" className="w-fit mx-auto"></Button>
              </div> : <></>}
              
            {
              showAnswers ? 
              (allAnswers.length > 0 ?  (
                allAnswers.filter((e) => e.question_id == question.id)
                .slice().sort((a, b) =>   new Date(b.answered_date).getTime() - new Date(a.answered_date).getTime())
                .map((a) => <Answer answer={a} posted_user={postedUser}/>)
              
              ) :<></>) : <></>
            }
            </div>
        </div>
        </>
        )
        }
        </div>
  );
}