"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import LoadingAnimation from "@/components/LoadingAnimation";
import ITopic from "@/app/interfaces/ITopic";
import IQuestion from "../../functions/src/interfaces/IQuestion";

// one color per topic, repeated if there are more topics
const COLORS = [
  "#9333ea", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444",
  "#ec4899", "#6366f1", "#14b8a6", "#f97316", "#84cc16",
];

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({
  icon,
  label,
  value,
  index,
}: {
  icon: string;
  label: string;
  value: number | string;
  index: number;
}) {
  return (
    <div
      className="flex flex-row items-center gap-4 bg-purple-50 rounded-xl p-4 animate-pop-in transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center">
        <i className={`pi ${icon}`} style={{ fontSize: "1.25rem" }} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </div>
  );
}

// topic ids can be numbers or strings, so compare them as strings
function findTopicTitle(topics: ITopic[], topicId: number | string) {
  return topics.find((t) => String(t.id) === String(topicId))?.title ?? "Unknown topic";
}

export default function UserQuestions({ userId }: { userId: string }) {
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [topics, setTopics] = useState<Array<ITopic>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/questions_by_user/${userId}`),
      axios.get("/api/topics"),
    ])
      .then(([questionsRes, topicsRes]) => {
        const data: Array<IQuestion> = questionsRes.data;
        setQuestions(
          data.sort(
            (a, b) => new Date(b.posted_time).getTime() - new Date(a.posted_time).getTime()
          )
        );
        setTopics(topicsRes.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  function topicTitle(topicId: number | string) {
    return findTopicTitle(topics, topicId);
  }

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of questions) {
      const name = findTopicTitle(topics, q.topic_id);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [questions, topics]);

  // questions per month for the last 12 months
  const monthly = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        count: 0,
      };
    });
    for (const q of questions) {
      const d = new Date(q.posted_time);
      const month = months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (month) month.count++;
    }
    return months;
  }, [questions]);

  const totalUpvotes = questions.reduce((sum, q) => sum + (q.up_voted_by?.length ?? 0), 0);
  const topicColors = topicCounts.map((_, i) => COLORS[i % COLORS.length]);

  const axisOptions = {
    ticks: { color: "#6b7280", precision: 0 },
    grid: { color: "#e5e7eb" },
  };

  const barData = {
    labels: topicCounts.map(([name]) => name),
    datasets: [
      {
        label: "Questions",
        data: topicCounts.map(([, count]) => count),
        backgroundColor: topicColors,
        borderRadius: 6,
      },
    ],
  };
  const barOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { ...axisOptions, beginAtZero: true }, y: { ...axisOptions, grid: { display: false } } },
  };

  const doughnutData = {
    labels: topicCounts.map(([name]) => name),
    datasets: [{ data: topicCounts.map(([, count]) => count), backgroundColor: topicColors }],
  };
  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: { legend: { position: "bottom", labels: { color: "#374151", usePointStyle: true } } },
  };

  const lineData = {
    labels: monthly.map((m) => m.label),
    datasets: [
      {
        label: "Questions",
        data: monthly.map((m) => m.count),
        borderColor: "#9333ea",
        backgroundColor: "rgba(147, 51, 234, 0.15)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#9333ea",
      },
    ],
  };
  const lineOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { ...axisOptions, grid: { display: false } }, y: { ...axisOptions, beginAtZero: true } },
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <LoadingAnimation />
      </div>
    );

  if (error)
    return <p className="text-center text-red-600 p-10">Can&apos;t load your questions.</p>;

  if (questions.length === 0)
    return (
      <div className="flex flex-col items-center gap-4 p-12 text-center">
        <i className="pi pi-question-circle text-purple-300" style={{ fontSize: "3.5rem" }} />
        <h2 className="text-xl font-bold text-gray-700">You haven&apos;t asked any questions yet</h2>
        <p className="text-gray-500">Your questions and statistics about them will show up here.</p>
        <Link href="/ask-a-question">
          <Button label="Ask a question" icon="pi pi-plus" />
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="pi-question" label="Questions asked" value={questions.length} index={0} />
        <StatCard icon="pi-tags" label="Topics" value={topicCounts.length} index={1} />
        <StatCard icon="pi-thumbs-up" label="Upvotes received" value={totalUpvotes} index={2} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Your questions</h2>
        {questions.map((q, i) => (
          <Link
            key={q.id}
            href={`/topics/${q.topic_id}`}
            style={{ animationDelay: `${Math.min(i, 8) * 60 + 200}ms` }}
            className="group block border border-gray-200 rounded-xl p-5 animate-fade-in-up transition-all hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 duration-200"
          >
            <div className="flex flex-row justify-between items-start gap-4 flex-wrap">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-700">
                {q.title}
              </h3>
              <Tag value={topicTitle(q.topic_id)} className="bg-purple-100 text-purple-700" />
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{q.text}</p>
            <div className="flex flex-row gap-5 mt-3 text-sm text-gray-500">
              <span>
                <i className="pi pi-calendar mr-1" style={{ fontSize: "0.8rem" }} />
                {formatDate(q.posted_time)}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-5 animate-fade-in-up [animation-delay:300ms]">
            <h3 className="font-semibold text-gray-700 mb-3">Questions per topic</h3>
            <div className="h-72">
              <Chart type="bar" data={barData} options={barOptions} className="h-full" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 animate-fade-in-up [animation-delay:300ms]">
            <h3 className="font-semibold text-gray-700 mb-3">Topic distribution</h3>
            <div className="h-72">
              <Chart type="doughnut" data={doughnutData} options={doughnutOptions} className="h-full" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 lg:col-span-2 animate-fade-in-up [animation-delay:400ms]">
            <h3 className="font-semibold text-gray-700 mb-3">Activity in the last 12 months</h3>
            <div className="h-64">
              <Chart type="line" data={lineData} options={lineOptions} className="h-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
