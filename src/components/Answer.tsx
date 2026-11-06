"use client"
import React, { useEffect,useRef } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import IAnswer from "../../functions/src/interfaces/IAnswer";
import UserTitleBadge from "./UserTitleBadge";
import axios from "axios";
import { useState } from 'react';
import { Toast } from "primereact/toast";
import { UserAuth } from "@/app/context/AuthContext";

interface AnswerProps {
  answer: IAnswer;
  // id of the user who asked the question, only they can approve answers
  questionOwnerId: string;
  // position in the list, staggers the entrance animation
  index?: number;
}

export default function Answer(props : AnswerProps){
    const toast = useRef<Toast>(null)
    const {user} = UserAuth()
    const [postedUser,setPostedUser] = useState<IUser>();
    const [thisAnswer,setThisAnswer] = useState<IAnswer>(props.answer)
    const approved = thisAnswer.approved;
    const isQuestionOwner = !!user && user.uid === props.questionOwnerId;
    const upVoted = !!user && thisAnswer.up_voted_by.includes(user.uid);
    const downVoted = !!user && thisAnswer.down_voted_by.includes(user.uid);
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

      const showInfo = (mess: string) => {
        toast.current?.show({
          severity: "info",
          summary: "Info",
          detail: mess,
          life: 3000,
        });
      };

      // updates the answer on screen right away, and undoes it if saving fails
      async function saveAnswer(updated: IAnswer, errorMessage: string) {
        const previous = thisAnswer;
        setThisAnswer(updated);
        try {
          await axios.put("/api/answers/" + updated.id, {
            id: updated.id,
            text: updated.text,
            question_id: updated.question_id,
            answered_user_id: updated.answered_user_id,
            answered_date: updated.answered_date,
            approved: updated.approved,
            up_voted_by: updated.up_voted_by,
            down_voted_by: updated.down_voted_by,
          });
        } catch (err) {
          console.log(err);
          setThisAnswer(previous);
          showError(errorMessage);
        }
      }

      // Votes with the logged in user's id. Clicking the same arrow again removes the vote,
      // clicking the other arrow moves the vote there.
      function vote(direction: "up" | "down") {
        if (!user) {
          showInfo("You must be logged in to vote!");
          return;
        }
        const alreadyVoted = direction === "up" ? upVoted : downVoted;
        const up_voted_by = thisAnswer.up_voted_by.filter((id) => id !== user.uid);
        const down_voted_by = thisAnswer.down_voted_by.filter((id) => id !== user.uid);
        if (!alreadyVoted) {
          if (direction === "up") up_voted_by.push(user.uid);
          else down_voted_by.push(user.uid);
        }
        saveAnswer({ ...thisAnswer, up_voted_by, down_voted_by }, "Can't save your vote.");
      }

      useEffect(() => {
        axios
          .get(`/api/users/${thisAnswer.answered_user_id}`)
          .then((res) => {
            const data = res.data;
            setPostedUser(data);
          })
          .catch((err) => console.log(err));
      },[thisAnswer.answered_user_id])

      function getYMDForAnswer(){
        const date : Date = new Date(thisAnswer.answered_date)

        return date.getFullYear() + ". " + months[date.getMonth()] + " " + date.getDate() +"."
      }

      function approveAnswer(){
        if (!isQuestionOwner) return;
        saveAnswer({ ...thisAnswer, approved: !approved }, "Can't save the approval.");
      }

    return(
      <>
      <Toast ref={toast} />
      {postedUser
         ?
          <div
            className={`flex flex-row w-full p-3 sm:p-5 gap-3 sm:gap-5 rounded-xl border transition-colors duration-300 animate-fade-in-up ${
              approved ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-purple-300"
            }`}
            style={{ animationDelay: `${Math.min(props.index ?? 0, 8) * 60}ms` }}
          >
            <div className="flex flex-col items-center gap-1 text-gray-500">
                <i
                  className={`pi pi-chevron-up cursor-pointer hover:text-purple-600 p-1 transition-transform duration-150 hover:-translate-y-0.5 active:scale-125 ${upVoted ? "text-purple-600 font-bold" : ""}`}
                  title={upVoted ? "Remove your upvote" : "Upvote"}
                  onClick={() => vote("up")}
                />
                <span className="font-semibold text-gray-700">{thisAnswer.up_voted_by.length}</span>
                <span className="w-4 border-t border-gray-200 my-1" />
                <span className="font-semibold text-gray-700">{thisAnswer.down_voted_by.length}</span>
                <i
                  className={`pi pi-chevron-down cursor-pointer hover:text-purple-600 p-1 transition-transform duration-150 hover:translate-y-0.5 active:scale-125 ${downVoted ? "text-purple-600 font-bold" : ""}`}
                  title={downVoted ? "Remove your downvote" : "Downvote"}
                  onClick={() => vote("down")}
                />
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                    <span className="flex flex-row items-center gap-2">
                      <span className="font-semibold text-gray-700">@{postedUser?.username}</span>
                      <UserTitleBadge title={postedUser?.title} />
                    </span>
                    <span>
                      <i className="pi pi-calendar mr-1" style={{ fontSize: "0.75rem" }} />
                      {getYMDForAnswer()}
                    </span>
                    {approved && (
                      <span className="text-green-700 font-semibold animate-pop-in">
                        <i className="pi pi-check-circle mr-1" style={{ fontSize: "0.8rem" }} />
                        Approved
                      </span>
                    )}
                </div>
                <p className="text-gray-700 whitespace-pre-line wrap-break-word">{thisAnswer.text}</p>
            </div>
            {
              isQuestionOwner ?
                <div className="self-start">
                  <button
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer duration-200 relative group ${
                      approved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                    onClick={approveAnswer}
                  >
                    <i className={approved ? "pi pi-times" : "pi pi-check"} />
                    <span className="absolute bottom-full right-0 mb-2 hidden w-max bg-gray-800 text-white text-xs rounded py-1 px-2 group-hover:block">
                      {approved ? "Disapprove answer" : "Approve answer"}
                    </span>
                  </button>
                </div>
                :
                <></>
            }
        </div>
         :
         <></>
        }
        </>
    )
}
