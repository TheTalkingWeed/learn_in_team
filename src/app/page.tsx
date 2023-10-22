"use client";
import Image from "next/image";
import question from "@/assets/question.png";
import questionbro from "@/assets/question-bro.png";

import Link from "next/link";

export default function Home() {
  let index = 0;
  const professions = [
    "teacher",
    "doctor",
    "chemist",
    "engineer",
    "designer",
    "biologist",
    "psychologist",
    "mathematician",
    "physicist",
    "developer",
    "teacher",
  ];

  return (
    <div className="min-h-screen w-full bg-purple-100 grid grid-cols-1 px-32 py-16 gap-y-16 pb-44">
      <div className="w-full flex flex-col items-center gap-y-5 my-6 ">
        <h1 className="font-bold text-7xl tracking-wider">
          Welcome to LearnInTeam
        </h1>
        <h1 className="tracking-widest">Be clever but together</h1>
      </div>
      <div className="grid grid-cols-2 place-items-center h-fit">
        <div className="grid grid-cols-1 pt-24">
          <h1 className="font-bold text-4xl mb-5">What is LearnInTeam?</h1>
          <p className="text-lg leading-9">
            LearnInTeam is the ultimate platform for everyone to collaborate and
            learn together. With LearnInTeam, you can post your questions and
            receive answers from a community of experts and enthusiasts. Join
            now and take your learning experience to the next level!
          </p>
          <div className="mt-10">
            <button className="w-24 h-11 px-4 py-2 font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300 ">
              Sign up
            </button>
          </div>
        </div>
        <div className="">
          <Image src={question} alt="" width={500} height={500} />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 place-items-center h-fit">
          <div className="">
            <Image src={questionbro} alt="" width={500} height={500} />
          </div>
          <div className="grid grid-cols-1 pt-24">
            <h1 className="font-bold text-4xl mb-5 flex flex-row h-[50px]">
              Are you a{" "}
              <div className="overflow-hidden ">
                {professions.map((p) => {
                  return (
                    <span
                      key={index++}
                      className=" block h-full pl-[10px] animate-wordchange"
                    >
                      {p}?
                    </span>
                  );
                })}
              </div>
            </h1>
            <p className="text-lg leading-9 ">
              Then LearnInTeam is the perfect platform for you to share your
              knowledge, answer questions, and collaborate with others in your
              field. Join our community to connect, learn, and contribute to a
              wealth of collective knowledge in yout area of expertise.
            </p>
            <div className="mt-10">
              <Link
                href="/ask-a-question"
                className="w-54 h-11 px-4 py-2 font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300 "
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
