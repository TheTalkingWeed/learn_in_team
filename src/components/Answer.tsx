"use client"
import React, { use, useEffect,useRef } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import IAnswer from "../../functions/src/interfaces/IAnswer";
import axios from "axios";
import { useState } from 'react';
import { Toast } from "primereact/toast";
import { UserAuth } from "@/app/context/AuthContext";
export default function Answer(props : any){
    const toast = useRef<Toast>(null)
    const {user} = UserAuth()
    const posted_user : IUser= props.posted_user
    const [thisAnswer,setThisAnswer] = useState<IAnswer>(props.answer)
    const [approved,setApproved] = useState<boolean>(thisAnswer.approved);
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

    function handleDownVote(userId: string) {
        if (posted_user){
        // Check if the user has already downvoted the question
    
          if (thisAnswer.down_voted_by.includes(userId)) {
            // If yes, update the state by removing the user ID from the down_voted_by array
            setThisAnswer(prevThisAnswer => ({
              ...prevThisAnswer,
              down_voted_by: prevThisAnswer.down_voted_by.filter(id => id !== userId),
            }));
          } else {
            // If not, check if the user has upvoted the question
            if (thisAnswer.up_voted_by.includes(userId)) {
              // If yes, remove the upvote before adding the downvote
              setThisAnswer(prevThisAnswer => ({
                ...prevThisAnswer,
                up_voted_by: prevThisAnswer.up_voted_by.filter(id => id !== userId),
                down_voted_by: [...prevThisAnswer.down_voted_by, userId],
              }));
            } else {
              // If not, update the state by adding the user ID to the down_voted_by array
              setThisAnswer(prevThisAnswer => ({
                ...prevThisAnswer,
                down_voted_by: [...prevThisAnswer.down_voted_by, userId],
              }));
            }
          }
    
        }else if (!posted_user){
          showMess("You must be logged in to downvote!")
        }
      }
      function handleUpVote(userId: string) {
        if(posted_user){
    
          // Check if the user has already upvoted the question
          if (thisAnswer.up_voted_by.includes(userId)) {
            // If yes, update the state by removing the user ID from the up_voted_by array
            setThisAnswer(prevThisAnswer => ({
              ...prevThisAnswer,
              up_voted_by: prevThisAnswer.up_voted_by.filter(id => id !== userId),
            }));
          } else {
            // If not, check if the user has downvoted the question
            if (thisAnswer.down_voted_by.includes(userId)) {
              // If yes, remove the downvote before adding the upvote
              setThisAnswer(prevThisAnswer => ({
                ...prevThisAnswer,
                down_voted_by: prevThisAnswer.down_voted_by.filter(id => id !== userId),
                up_voted_by: [...prevThisAnswer.up_voted_by, userId],
              }));
            } else {
              // If not, update the state by adding the user ID to the up_voted_by array
              setThisAnswer(prevThisAnswer => ({
                ...prevThisAnswer,
                up_voted_by: [...prevThisAnswer.up_voted_by, userId],
              }));
            }
          }
        }else if(!posted_user){
          showMess("You must be logged in to upvote!")
    
        }
      }
    
      useEffect(() => {
        console.log(posted_user.id + " <---posted");
      },[])

      useEffect(() => {

        axios.put("/api/answers/"+ thisAnswer.id,{
            id: thisAnswer.id,
            text: thisAnswer.text,
            question_id: thisAnswer.question_id,
            answered_user_id: thisAnswer.answered_user_id,
            answered_date: thisAnswer.answered_date,
            approved: thisAnswer.approved,
            up_voted_by: thisAnswer.up_voted_by,
            down_voted_by: thisAnswer.down_voted_by, 
      })
      },[
        thisAnswer.up_voted_by
      ])
    
      useEffect(() => {
    
        axios.put("/api/answers/"+ thisAnswer.id,{
            id: thisAnswer.id,
            text: thisAnswer.text,
            question_id: thisAnswer.question_id,
            answered_user_id: thisAnswer.answered_user_id,
            answered_date: thisAnswer.answered_date,
            approved: thisAnswer.approved,
            up_voted_by: thisAnswer.up_voted_by,
            down_voted_by: thisAnswer.down_voted_by, 
        })
    
      },[
          thisAnswer.down_voted_by
      ])
      useEffect(() => {
    
        axios.put("/api/answers/"+ thisAnswer.id,{
            id: thisAnswer.id,
            text: thisAnswer.text,
            question_id: thisAnswer.question_id,
            answered_user_id: thisAnswer.answered_user_id,
            answered_date: thisAnswer.answered_date,
            approved: approved,
            up_voted_by: thisAnswer.up_voted_by,
            down_voted_by: thisAnswer.down_voted_by, 
        })
    
      },[
          approved
      ])
    
      function getYMDForAnswer(){
        let date : Date = new Date(thisAnswer.answered_date)
        
        return date.getFullYear() + ". " + months[date.getMonth()] + " " + date.getDate() +"."
      }

      function approveAnswer(){
        setApproved(!approved)
      }

    return(
        <div className="flex flex-row h-auto bg-[#f0f4ff] w-full my-2 p-5 gap-5">
            <div className="flex flex-row gap-x-6 items-center">
                <div className="flex flex-col items-center justify-center gap-y-3">
                <div className="flex flex-col text-center">
                    <span >{thisAnswer.up_voted_by.length}</span>
                    <i className={`pi pi-chevron-up cursor-pointer`} onClick={(e) => handleUpVote(posted_user.id)}/>
                </div> 
                {
                    <h1 className={`font-bold text-green-700 ${approved ? "opacity-100" : "opacity-0"}`}>✓</h1> 
                }
                <div className="flex flex-col text-center">
                    <i className="pi pi-chevron-down cursor-pointer" onClick={(e) => handleDownVote(posted_user.id)}/>
                    <span >{thisAnswer.down_voted_by.length}</span>
                </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col ">
                    <span className="text-sm">Posted by: {posted_user.username}</span>
                    <span className="text-sm">Posted at: {getYMDForAnswer()}</span>
                </div>
                <span>{props.answer.text}</span>
            </div>
            {
                approved ? 
                <div className="ml-auto self-end">
                    <h1 className="flex cursor-pointer self-end ml-auto bg-[#e9d5ff] px-3 rounded-lg font-bold select-none relative group" onClick={approveAnswer}>
                    ✘
                    <span className="absolute bottom-full mb-2 hidden w-max bg-black text-white text-xs rounded py-1 px-2 group-hover:block">
                        Disapprove Answer
                    </span>
                    </h1>
                </div>
                 :
                (posted_user.email === user.email) ? <div className="ml-auto self-end">
                <h1 className="flex cursor-pointer self-end ml-auto bg-[#e9d5ff] px-3 rounded-lg font-bold select-none relative group " onClick={approveAnswer}>
                ✓
                <span className="absolute bottom-full mb-2 hidden w-max bg-black text-white text-xs rounded py-1 px-2 group-hover:block">
                    Approve Answer
                </span>
                </h1>
            </div> : <></>
                
            }
        </div>
    )
}