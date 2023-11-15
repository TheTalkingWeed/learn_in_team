"use client";


import React, { useEffect } from "react";
import IUser from "../../functions/src/interfaces/IUser";
import IQuestion from "../../functions/src/interfaces/IQuestion";

export default function QuestionCard(props: any) {
  const question :IQuestion =  props.question;
  const user :IUser= props.user

  return (
    <div className="w-[80%] flex flex-col bg-slate-300 h-fit p-5 gap-y-4">
      <div className="flex flex-row gap-x-6 items-center">
        <div className="flex flex-col items-center justify-center gap-y-3">
          <div className="flex flex-col text-center">
            <span>{question.up_voted_by.length}</span>
            <i className="pi pi-chevron-up cursor-pointer"/>
          </div>
          <div className="flex flex-col text-center">
            <i className="pi pi-chevron-down cursor-pointer"/>
            <span>{question.down_voted_by.length}</span>
          </div>
        </div>
        <div className="w-16 aspect-square ">
          {user.profile_picture ? 
          <img src={user.profile_picture} alt="pfp" className="object-cover" />:
          <img src="../../assets/pfp.png" alt="pfp"  className="object-cover"/>}
        </div>
        <div className="flex flex-col">
            <h1 className="font-bold text-2xl text-left">{question.title}</h1>
            <p>by {user.username}</p>

        </div>
      </div>
      <div className="w-full bg-slate-200 p-5">{question.text}</div>
    </div>
  );
}
