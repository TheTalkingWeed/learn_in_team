"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ITopic from "../interfaces/ITopic";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import IQuestion from "../../../functions/src/interfaces/IQuestion";
import LoadingAnimation from "@/components/LoadingAnimation";

const TITLE_MAX = 150;
const TEXT_MAX = 5000;

const tips = [
  { icon: "pi-tag", text: "Pick the topic that fits best, so the right people find your question." },
  { icon: "pi-pencil", text: "Write a short title that says what the problem is." },
  { icon: "pi-list", text: "Explain what you want to know and what you already tried." },
  { icon: "pi-search", text: "Check the topic first, maybe someone already asked the same thing." },
];

function Field({
  label,
  hint,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-row justify-between items-end gap-3">
        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        {counter && <span className="text-xs text-gray-400">{counter}</span>}
      </div>
      {children}
      {hint && <span className="text-sm text-gray-500">{hint}</span>}
    </div>
  );
}

export default function Page() {
  const { user, loading: authLoading } = UserAuth();
  const navi = useRouter();
  const toast = useRef<Toast>(null);

  const [title, setTitle] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [topics, setTopics] = useState<Array<ITopic>>([]);
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);

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
    Promise.all([axios.get("/api/topics"), axios.get("/api/questions")])
      .then(([topicsRes, questionsRes]) => {
        setTopics(topicsRes.data);
        setQuestions(questionsRes.data);
      })
      .catch((err) => {
        console.log(err);
        showError("Can't load the topics.");
      })
      .finally(() => setLoading(false));
  }, []);

  // one more than the biggest id, so ids stay unique even after questions were deleted
  function generateQId(): number {
    return questions.reduce((max, q) => Math.max(max, Number(q.id) || 0), 0) + 1;
  }

  function clearFields() {
    setTitle("");
    setQuestionText("");
    setTopicId("");
  }

  const selectedTopic = topics.find((t) => String(t.id) === String(topicId));
  const canSubmit = !!topicId && title.trim() !== "" && questionText.trim() !== "" && !posting;

  function postQuestion() {
    if (!user) {
      showError("You must be logged in to post a question");
      return;
    }
    if (!canSubmit) {
      showError("Please fill all fields");
      return;
    }
    setPosting(true);
    axios
      .post("/api/questions", {
        id: generateQId(),
        text: questionText.trim(),
        title: title.trim(),
        topic_id: selectedTopic?.id,
        posted_user_id: user.uid,
        posted_time: new Date(),
        up_voted_by: [],
        down_voted_by: [],
      })
      .then(() => {
        showMess("Question posted, redirecting to your profile...");
        clearFields();
        setTimeout(() => navi.push("/profile"), 1000);
      })
      .catch((err) => {
        console.log(err);
        showError("Can't post question");
        setPosting(false);
      });
  }

  if (authLoading)
    return (
      <div className="min-h-screen bg-purple-100 flex justify-center p-10">
        <LoadingAnimation />
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-purple-100 flex flex-col items-center gap-4 p-20 text-center">
        <i className="pi pi-lock text-purple-400" style={{ fontSize: "3rem" }} />
        <h1 className="text-2xl font-bold">You must be logged in to ask a question</h1>
        <p className="text-gray-600">Log in or create a free account to ask the community.</p>
        <div className="flex flex-row gap-3">
          <Link href="/login">
            <Button label="Log in" />
          </Link>
          <Link href="/registration">
            <Button label="Sign up" outlined />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-purple-100 py-10 px-4">
      <Toast ref={toast} />
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
          <div className="bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400 px-6 sm:px-10 py-8 text-white">
            <h1 className="text-4xl font-bold tracking-wide">Ask a question</h1>
            <p className="mt-2 text-purple-100 text-lg">
              Stuck with something? Ask the community and get help from students and teachers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <form
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 animate-fade-in-up [animation-delay:100ms]"
            onSubmit={(e) => {
              e.preventDefault();
              postQuestion();
            }}
          >
            {loading ? (
              <div className="flex justify-center p-10">
                <LoadingAnimation />
              </div>
            ) : (
              <>
                <Field label="Topic" hint="You can type in the list to search for a topic.">
                  <Dropdown
                    className="w-full"
                    value={topicId}
                    options={topics}
                    optionLabel="title"
                    optionValue="id"
                    onChange={(e) => setTopicId(e.value)}
                    placeholder="Select a topic"
                    filter
                    emptyMessage="No topics yet"
                  />
                </Field>

                <Field label="Title" counter={`${title.length}/${TITLE_MAX}`}>
                  <InputText
                    className="w-full"
                    value={title}
                    maxLength={TITLE_MAX}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How do I solve quadratic equations?"
                  />
                </Field>

                <Field
                  label="Explain your problem"
                  counter={`${questionText.length}/${TEXT_MAX}`}
                  hint="Describe what you want to know and what you already tried."
                >
                  <InputTextarea
                    className="w-full"
                    autoResize={true}
                    value={questionText}
                    maxLength={TEXT_MAX}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={7}
                    placeholder="Write the details of your question here..."
                  />
                </Field>

                <div className="flex flex-row flex-wrap justify-end gap-2 pt-2 border-t border-gray-200">
                  <Button
                    type="button"
                    label="Clear"
                    text
                    onClick={clearFields}
                    disabled={posting || (!title && !questionText && !topicId)}
                  />
                  <Button
                    type="submit"
                    label="Post question"
                    icon="pi pi-send"
                    iconPos="right"
                    loading={posting}
                    disabled={!canSubmit}
                  />
                </div>
              </>
            )}
          </form>

          <aside className="flex flex-col gap-6 animate-fade-in-up [animation-delay:200ms]">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <i className="pi pi-lightbulb mr-2 text-purple-500" />
                Tips for a good question
              </h2>
              <ul className="flex flex-col gap-3">
                {tips.map((tip) => (
                  <li key={tip.icon} className="flex flex-row gap-3 text-gray-700">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                      <i className={`pi ${tip.icon}`} style={{ fontSize: "0.85rem" }} />
                    </span>
                    <span className="text-sm pt-1.5">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Preview
              </h2>
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex flex-row justify-between items-start gap-3">
                  <h3 className={`font-bold wrap-break-word ${title ? "text-gray-800" : "text-gray-400"}`}>
                    {title || "Your question title"}
                  </h3>
                  {selectedTopic && (
                    <Tag value={selectedTopic.title} className="bg-purple-100 text-purple-700 shrink-0" />
                  )}
                </div>
                <p
                  className={`text-sm whitespace-pre-line wrap-break-word line-clamp-6 ${
                    questionText ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {questionText || "The details of your question will show up here."}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                <i className="pi pi-sparkles mr-1 text-purple-500" style={{ fontSize: "0.75rem" }} />
                Just a quick question? Try the AI assistant in the bottom right corner.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
