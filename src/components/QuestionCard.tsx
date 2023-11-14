import React from "react";

export default function QuestionCard(props: any) {
  const question = props.question;
  return (
    <div className="w-[80%] bg-slate-300 h-fit">
      <h1>{question.title}</h1>
      <h1>{question.posted_time}</h1>
      <h1>{question.posted_user_id}</h1>
      <h1>{question.text}</h1>
    </div>
  );
}
