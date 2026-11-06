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
    <div className="min-h-screen w-full bg-purple-100 grid grid-cols-1 px-4 sm:px-10 lg:px-32 py-10 sm:py-16 gap-y-12 lg:gap-y-16 pb-24 lg:pb-44">
      <div className="w-full flex flex-col items-center gap-y-3 sm:gap-y-5 my-6 text-center">
        <h1 className="font-bold text-4xl sm:text-5xl lg:text-7xl tracking-wider animate-fade-in-up">
          Welcome to LearnInTeam
        </h1>
        <h1 className="tracking-widest animate-fade-in-up [animation-delay:150ms]">Be clever but together</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-8 h-fit">
        <div className="grid grid-cols-1 lg:pt-24 animate-fade-in-up [animation-delay:300ms]">
          <h1 className="font-bold text-3xl sm:text-4xl mb-5">What is LearnInTeam?</h1>
          <p className="text-base sm:text-lg leading-8 sm:leading-9">
            LearnInTeam is the ultimate platform for everyone to collaborate and
            learn together. With LearnInTeam, you can post your questions and
            receive answers from a community of experts and enthusiasts. Join
            now and take your learning experience to the next level!
          </p>
          <div className="mt-10">
            <Link href={"/registration"} className="inline-block w-24 h-11 px-4 py-2 font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-300 duration-300 " >
              Sign up
            </Link>
          </div>
        </div>
        <div className="animate-fade-in [animation-delay:450ms]">
          <Image src={question} loading="eager" alt="" width={500} height={500} className="w-full max-w-[500px] h-auto animate-float" />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-8 h-fit">
          {/* on phones the text comes first, the picture after it */}
          <div className="order-2 lg:order-1">
            <Image src={questionbro} loading="eager" alt="" width={500} height={500} className="w-full max-w-[500px] h-auto animate-float [animation-delay:-3s]" />
          </div>
          <div className="grid grid-cols-1 lg:pt-24 order-1 lg:order-2">
            <h1 className="font-bold text-2xl sm:text-4xl mb-5 flex flex-row h-8 sm:h-12.5">
              Are you a{" "}
              <div className="overflow-hidden ">
                {professions.map((p) => {
                  return (
                    <span
                      key={index++}
                      className=" block h-full pl-2.5 animate-wordchange"
                    >
                      {p}?
                    </span>
                  );
                })}
              </div>
            </h1>
            <p className="text-base sm:text-lg leading-8 sm:leading-9 ">
              Then LearnInTeam is the perfect platform for you to share your
              knowledge, answer questions, and collaborate with others in your
              field. Join our community to connect, learn, and contribute to a
              wealth of collective knowledge in yout area of expertise.
            </p>
            <div className="mt-10">
              <Link
                href="/ask-a-question"
                className="inline-block w-54 h-11 px-4 py-2 font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-300 duration-300 "
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
