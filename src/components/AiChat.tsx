"use client";

import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { User } from "firebase/auth";
import { UserAuth } from "@/app/context/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGE_LENGTH = 2000;

// The chat is only for logged in users. The key makes a new chat for every user,
// and logging out unmounts it, which clears the conversation and stops a running answer.
export default function AiChat() {
  const { user } = UserAuth();
  if (!user) return null;
  return <ChatWindow key={user.uid} user={user} />;
}

function ChatWindow({ user }: { user: User }) {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // keep the newest message in view while the answer streams in
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  // stop a running answer when the component unmounts
  useEffect(() => () => abortRef.current?.abort(), []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history: Message[] = [...messages, { role: "user", content: text }];
    // the empty assistant message is filled while the answer streams in
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      // the server checks this token, Firebase refreshes it when it's expired
      const idToken = await user.getIdToken();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        // failed answers are left out so they aren't sent back to the model
        body: JSON.stringify({ messages: history.filter((m) => m.content !== "") }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        // show the server's reason (e.g. not configured, not logged in) when it sent one
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Chat request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
        });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.log(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            err instanceof Error && !err.message.startsWith("Chat request failed")
              ? `Sorry, I couldn't answer: ${err.message}`
              : "Sorry, I couldn't answer right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="group flex justify-center items-center w-14 aspect-square bg-purple-600 hover:bg-purple-700 rounded-full fixed bottom-8 right-8 sm:bottom-14 sm:right-14 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 z-50 animate-pop-in [animation-delay:500ms]"
        title={open ? "Close chat" : "Ask the AI assistant"}
      >
        <i
          // the key makes the icon remount, so it pops in when it changes
          key={open ? "close" : "open"}
          className={`${open ? "pi pi-times" : "pi pi-comment -scale-x-100"} animate-pop-in`}
          style={{ fontSize: "1.4rem", color: "white" }}
        />
      </button>

      {open && (
        <div className="fixed bottom-26 right-4 sm:bottom-32 sm:right-14 w-[calc(100vw-2rem)] max-w-sm h-[min(32rem,70vh)] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden z-50 origin-bottom-right animate-scale-in">
          <div className="flex flex-row items-center justify-between bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400 px-4 py-3 text-white">
            <div className="flex flex-col">
              <span className="font-bold">AI assistant</span>
              <span className="text-xs text-purple-100">Ask a quick question</span>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-purple-100 hover:text-white cursor-pointer"
                title="Start a new chat"
              >
                <i className="pi pi-refresh mr-1" style={{ fontSize: "0.7rem" }} />
                New chat
              </button>
            )}
          </div>

          <div ref={listRef} className="flex flex-col gap-3 flex-1 overflow-y-auto p-4 bg-purple-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center gap-2 text-gray-500 m-auto px-4">
                <i className="pi pi-sparkles text-purple-400" style={{ fontSize: "2rem" }} />
                <p className="text-sm">
                  Hi! Ask me anything quick, for example &quot;What is a prime number?&quot;
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word animate-pop-in ${
                  m.role === "user" ? "origin-bottom-right" : "origin-bottom-left"
                } ${
                  m.role === "user"
                    ? "self-end bg-purple-600 text-white rounded-br-sm"
                    : "self-start bg-white text-gray-800 shadow-sm rounded-bl-sm"
                }`}
              >
                {m.content || (
                  <span className="flex gap-1 py-1" aria-label="Thinking">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <form
            className="flex flex-row gap-2 p-3 border-t border-gray-200"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <InputText
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 p-inputtext-sm"
              autoFocus
            />
            <Button
              type="submit"
              icon="pi pi-send"
              rounded
              disabled={!input.trim() || loading}
              aria-label="Send"
            />
          </form>
        </div>
      )}
    </>
  );
}
