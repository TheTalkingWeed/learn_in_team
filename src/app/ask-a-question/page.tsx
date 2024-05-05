"use client";

import React, { useEffect, useRef, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ITopic from "../interfaces/ITopic";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import IQuestion from "../../../functions/src/interfaces/IQuestion";
export default function page() {
  const { user } = UserAuth();
  const navi = useRouter();
  const toast = useRef<Toast>(null);

  const [title, setTitle] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [topics, setTopics] = useState<Array<ITopic>>([]);
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    axios
      .get("/api/topics")
      .then((res) => {
        const data = res.data;
        setTopics(data);
      })
      .catch((err) => {
        showError("Can't get topics.");
      });
      setLoading(false)
    
      axios
      .get("/api/questions")
      .then((res) => {
        const data = res.data;
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        showError("Cant get questions.");
      });

  }, []);

  function generateQId(): number {
    return questions.length + 1;
  }

  function clearFields() {
    setTitle("");
    setQuestionText("");
    setTopic("");
  }

  function postQuestion() {
    if (!user) {
      showError("You must be logged in to post a question");
    } else {
      if (topic === "" || title === "" || questionText === "") {
        showError("Please fill all fields");
      } else {
        axios
          .post("/api/questions", {
            id: generateQId(),
            text: questionText,
            title: title,
            topic_id: topics.find((t) => t.title === topic)?.id,
            posted_user_id: user.uid,
            posted_time: new Date(),
            up_voted_by: [],
            down_voted_by: [],
          })
          .then((res) => {
            showMess("Question posted, redirection to your profile...");
            document.body.style.cursor = "wait";
            clearFields();
            setTimeout(() => {
              navi.push("/profile");
              document.body.style.cursor = "default";
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
            showError("Can't post question");
          });
      }
    }
  }
  return (
    <div className="w-full min-h-screen flex justify-center bg-purple-100">
      <Toast ref={toast} />

      {loading ? (
        <Skeleton width="100%"></Skeleton>
      ) : (
        <div className="bg-slate-50 mt-20 w-[50%] h-fit p-8 flex flex-col justify-center items-center rounded-lg">
          <h1 className="text-3xl font-bold tracking-wide mb-5">
            Ask a question
          </h1>
          <div className="flex flex-col w-[80%] gap-y-4">
            <div className="flex flex-col gap-y-2">
              <label className="text-xl font-semibold ">Select a Topic</label>
              <Dropdown
                className="w-full md:w-14rem"
                value={topic}
                options={topics.map((t) => t.title)}
                onChange={(e) => setTopic(e.value)}
                placeholder="Select a topic"
                filter
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-xl font-semibold ">Title</label>
              <InputText
                className="w-full "
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your question"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-xl font-semibold ">
                Explain your problem
              </label>
              <InputTextarea
                autoResize={true}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <Button
            label="Submit"
            className="mt-4 cursor-pointer  "
            onClick={() => postQuestion()}
            tooltip={!user ? "You must be logged in to post a question" : "asd"}
            tooltipOptions={{ position: "bottom" }}
          >
            <i className="pi pi-check ml-3"></i>
          </Button>
        </div>
      )}
    </div>
  );
}
