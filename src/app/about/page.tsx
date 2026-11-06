import React from "react";
import Link from "next/link";

const sections = [
  { id: "what-is-it", title: "What is LearnInTeam?", icon: "pi-info-circle" },
  { id: "getting-started", title: "Creating an account", icon: "pi-user-plus" },
  { id: "topics", title: "Browsing topics", icon: "pi-th-large" },
  { id: "asking", title: "Asking a question", icon: "pi-question-circle" },
  { id: "answering", title: "Answering questions", icon: "pi-comments" },
  { id: "voting", title: "Voting and approved answers", icon: "pi-thumbs-up" },
  { id: "profile", title: "Your profile", icon: "pi-id-card" },
  { id: "ai-chat", title: "The AI assistant", icon: "pi-sparkles" },
  { id: "tips", title: "Tips for good questions and answers", icon: "pi-lightbulb" },
];

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 scroll-mt-6 animate-fade-in-up"
      // the first sections come in one after another, the rest are below the screen anyway
      style={{ animationDelay: `${Math.min(sections.findIndex((s) => s.id === id) + 1, 4) * 90}ms` }}
    >
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 text-white flex items-center justify-center">
          <i className={`pi ${icon}`} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

function Steps({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex flex-row gap-3">
          <span className="w-7 h-7 shrink-0 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg px-4 py-3 text-sm text-gray-700">
      {children}
    </p>
  );
}

const linkClass = "text-purple-700 font-semibold underline hover:text-purple-900";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
          <div className="bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400 px-6 sm:px-10 py-10 text-white">
            <h1 className="text-4xl font-bold tracking-wide">About LearnInTeam</h1>
            <p className="mt-2 text-purple-100 text-lg">Be clever but together</p>
          </div>
          <nav className="p-6 sm:px-10" aria-label="Contents">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              On this page
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex flex-row items-center gap-2 text-gray-700 hover:text-purple-700">
                    <i className={`pi ${s.icon} text-purple-500`} style={{ fontSize: "0.85rem" }} />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Section {...sections[0]}>
          <p>
            LearnInTeam is a place where students and teachers learn together. If you are stuck
            with something, ask the community. If you know the answer to someone else&apos;s
            question, help them out. Every question and answer stays on the site, so the next
            person with the same problem can learn from it too.
          </p>
          <p>
            Anyone can browse the topics and read questions and answers. To ask, answer, vote or
            use the AI assistant you need a free account.
          </p>
        </Section>

        <Section {...sections[1]}>
          <Steps
            steps={[
              <>
                Click <strong>Sign up</strong> in the top right corner, or go to the{" "}
                <Link href="/registration" className={linkClass}>registration page</Link>.
              </>,
              <>
                Fill in your first and last name, a username, your born date and your email, and
                choose whether you are a <strong>Student</strong> or a <strong>Teacher</strong>.
              </>,
              <>
                Choose a password. It has to be at least 8 characters long and contain an uppercase
                letter, a lowercase letter and a number. A checklist shows which rules are already met.
                Click the eye icon to see what you typed.
              </>,
              <>
                Click <strong>Sign up</strong>. You are logged in and taken to your profile.
              </>,
            ]}
          />
          <p>
            You can also <Link href="/login" className={linkClass}>log in</Link> with your Google
            account by clicking the Google icon on the login page. If you forgot your password,
            use <Link href="/forgotpassword" className={linkClass}>Forgot your password?</Link> and
            we will email you a link to set a new one.
          </p>
        </Section>

        <Section {...sections[2]}>
          <p>
            Questions are organized into topics, like school subjects. Open the{" "}
            <Link href="/topics" className={linkClass}>Topics</Link> page and click a topic to see
            every question asked in it.
          </p>
          <p>
            Each question shows its title, who asked it and when, the full question and how many
            answers it has. Click <strong>Show answers</strong> to read them.
          </p>
          <p>
            Looking for something specific? Type a few words in the <strong>search bar</strong> at
            the top of the page and press Enter or the search button. You get every question
            whose title, text or topic contains all of your words, with the best matches first.
          </p>
        </Section>

        <Section {...sections[3]}>
          <Steps
            steps={[
              <>
                Log in, then click <strong>Ask a question</strong> in the menu (or go to the{" "}
                <Link href="/ask-a-question" className={linkClass}>ask a question page</Link>).
              </>,
              <>
                <strong>Select a topic</strong> that fits your question. You can type in the list
                to search for it.
              </>,
              <>
                Give your question a short, clear <strong>title</strong>, for example
                &quot;How do I solve quadratic equations?&quot;.
              </>,
              <>
                Under <strong>Explain your problem</strong>, describe what you want to know and
                what you have already tried.
              </>,
              <>
                Click <strong>Submit</strong>. Your question appears in the topic you chose and on
                your profile, where you can follow it.
              </>,
            ]}
          />
        </Section>

        <Section {...sections[4]}>
          <Steps
            steps={[
              <>Open a topic and find a question you can help with.</>,
              <>
                Click <strong>Write an answer</strong> under the question (you have to be logged
                in to see this button).
              </>,
              <>
                Write your answer in the box and click <strong>Submit answer</strong>, or{" "}
                <strong>Cancel</strong> if you changed your mind.
              </>,
            ]}
          />
          <p>
            Your answer shows up with your username and the date. Click{" "}
            <strong>Show answers</strong> to see it together with everyone else&apos;s answers,
            newest first.
          </p>
        </Section>

        <Section {...sections[5]}>
          <p>
            Every answer has arrows on its left side. When you are logged in, use the{" "}
            <strong>up arrow</strong> if an answer was helpful and the <strong>down arrow</strong>{" "}
            if it wasn&apos;t. You have one vote per answer: your vote is highlighted, clicking
            the same arrow again takes it back, and clicking the other arrow changes it. The
            numbers show how many people voted each way, so the most useful answers are easy to
            spot.
          </p>
          <p>
            If you asked the question, you can <strong>approve</strong> the answer that solved
            your problem with the check button next to it. Approved answers get a green border and
            an &quot;Approved&quot; label, so everyone can see which answer worked. Click the
            button again to take the approval back.
          </p>
        </Section>

        <Section {...sections[6]}>
          <p>
            Click the person icon in the top right corner to open your{" "}
            <Link href="/profile" className={linkClass}>profile</Link>. It has two tabs:
          </p>
          <ul className="flex flex-col gap-3">
            <li className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-1">
                <i className="pi pi-user mr-2 text-purple-500" />
                Profile information
              </h3>
              Shows your name, username, email, title, gender and born date. Click{" "}
              <strong>Edit</strong> to change them and <strong>Save</strong> when you are done.
              Your email can&apos;t be changed here because you use it to log in.
            </li>
            <li className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-1">
                <i className="pi pi-comments mr-2 text-purple-500" />
                Your questions
              </h3>
              Lists every question you asked, with its topic, date and votes. Below the list,
              charts show which topics you ask about the most and how active you were in the
              last 12 months.
            </li>
          </ul>
          <p>
            To change your <strong>profile picture</strong>, click the camera button on your
            picture. Upload an image, zoom with the slider, drag it to position it, rotate it if
            needed, then click <strong>Save</strong>. You can also remove your picture there.
          </p>
        </Section>

        <Section {...sections[7]}>
          <p>
            When you are logged in, a purple chat button appears in the bottom right corner of
            every page. Click it to ask the AI assistant a quick question, for example
            &quot;What is a prime number?&quot; or &quot;What does photosynthesis mean?&quot;.
            The answer appears as it is being written, and you can ask follow-up questions in the
            same chat. Click <strong>New chat</strong> to start over.
          </p>
          <p>
            The assistant is good for quick explanations. For longer or more detailed problems,
            ask the community instead: real people can look at your exact problem, and their
            answers stay on the site for others.
          </p>
          <Note>
            The assistant is powered by Google Gemini. It can make mistakes, so double-check
            important facts. Don&apos;t share personal information in the chat. It has a free
            usage limit, so if many people use it at once you may need to wait a minute before
            asking again.
          </Note>
        </Section>

        <Section {...sections[8]}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">When you ask</h3>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Choose the right topic so the right people find it.</li>
                <li>Write a title that says what the problem is.</li>
                <li>Explain what you already tried and where you got stuck.</li>
                <li>Check whether someone already asked the same thing.</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">When you answer</h3>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Explain the steps, not just the final result.</li>
                <li>Use simple words and examples.</li>
                <li>Be kind and patient, everyone starts somewhere.</li>
                <li>Vote for the answers that helped you.</li>
              </ul>
            </div>
          </div>
        </Section>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ready to start?</h2>
            <p className="text-gray-600">Create a free account and ask your first question.</p>
          </div>
          <div className="flex flex-row gap-3">
            <Link
              href="/registration"
              className="px-5 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 duration-300"
            >
              Sign up
            </Link>
            <Link
              href="/topics"
              className="px-5 py-2 font-bold bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 duration-300"
            >
              Browse topics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
