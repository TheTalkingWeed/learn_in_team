"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import QuestionCard from "@/components/QuestionCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import ITopic from "@/app/interfaces/ITopic";
import IQuestion from "../../../functions/src/interfaces/IQuestion";
import { UserAuth } from "@/app/context/AuthContext";

// lowercase and without accents, so "fuggveny" also finds "függvény"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// A question matches when every word of the search is in its title, text or topic.
// Matches in the title count the most, so the best results come first.
function searchQuestions(questions: IQuestion[], topics: ITopic[], query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const topicTitles = new Map(topics.map((t) => [String(t.id), normalize(t.title ?? "")]));

  return questions
    .map((q) => {
      const title = normalize(q.title ?? "");
      const text = normalize(q.text ?? "");
      const topic = topicTitles.get(String(q.topic_id)) ?? "";
      let score = 0;
      for (const word of words) {
        const wordScore =
          (title.includes(word) ? 3 : 0) + (topic.includes(word) ? 2 : 0) + (text.includes(word) ? 1 : 0);
        if (wordScore === 0) return null;
        score += wordScore;
      }
      return { question: q, score };
    })
    .filter((r): r is { question: IQuestion; score: number } => r !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.question.posted_time).getTime() - new Date(a.question.posted_time).getTime()
    )
    .map((r) => r.question);
}

function SearchResults() {
  const query = useSearchParams()?.get("q")?.trim() ?? "";
  const { user } = UserAuth();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([axios.get("/api/questions"), axios.get("/api/topics")])
      .then(([questionsRes, topicsRes]) => {
        setQuestions(questionsRes.data);
        setTopics(topicsRes.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => searchQuestions(questions, topics, query), [questions, topics, query]);

  return (
    <div className="w-full min-h-screen bg-purple-100 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
          <div className="bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400 px-6 sm:px-10 py-8 text-white">
            <h1 className="text-3xl font-bold tracking-wide wrap-break-word">
              {query ? <>Search results for &quot;{query}&quot;</> : "Search"}
            </h1>
            {query && !loading && !error && (
              <p className="mt-2 text-purple-100">
                {results.length === 0
                  ? "No questions found"
                  : `${results.length} ${results.length === 1 ? "question" : "questions"} found`}
              </p>
            )}
          </div>
        </div>

        {!query ? (
          <p className="text-gray-600 p-10 text-center">
            Type something in the search bar at the top to find questions.
          </p>
        ) : loading ? (
          <div className="flex justify-center p-10">
            <LoadingAnimation />
          </div>
        ) : error ? (
          <p className="text-red-600 p-10 text-center">Can&apos;t load the questions, please try again.</p>
        ) : results.length === 0 ? (
          <div className="w-full bg-white rounded-2xl shadow-lg flex flex-col items-center gap-4 p-12 text-center animate-fade-in-up [animation-delay:100ms]">
            <i className="pi pi-search text-purple-300" style={{ fontSize: "3rem" }} />
            <h2 className="text-xl font-bold text-gray-700">No questions match your search</h2>
            <p className="text-gray-500">
              Try other or fewer words, or browse the topics.
              {user ? " If nobody asked it yet, ask it yourself!" : ""}
            </p>
            <div className="flex flex-row gap-3">
              <Link href="/topics">
                <Button label="Browse topics" outlined />
              </Link>
              {user && (
                <Link href="/ask-a-question">
                  <Button label="Ask a question" icon="pi pi-plus" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          // the key makes the cards reload when the search changes
          results.map((q, i) => (
            <QuestionCard
              key={`${query}-${q.id}`}
              question={q}
              index={i}
              topic={topics.find((t) => String(t.id) === String(q.topic_id))}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function Page() {
  // useSearchParams needs a Suspense boundary in Next.js
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-purple-100 flex justify-center p-10">
          <LoadingAnimation />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
