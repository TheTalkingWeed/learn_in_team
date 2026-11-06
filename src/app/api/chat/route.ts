import { ApiError, Content, GoogleGenAI } from "@google/genai";
import { firebaseConfig } from "@/app/firebaseConfig";

// This route runs on the Next.js server, so the API key never reaches the browser.
// The key is read from GEMINI_API_KEY (put it in .env.local), it's free from https://aistudio.google.com/apikey
// Next.js serves this file before the /api rewrite to Firebase in next.config.js.

// "latest" alias of Google's fast model, available on the free tier
const MODEL = "gemini-flash-latest";

const SYSTEM_PROMPT = `You are the assistant of LearnInTeam, a site where students and teachers ask and answer questions about school topics.
Answer quick questions clearly and briefly, in a few sentences or a short list. Explain things so a student can understand them.
If a question needs a long or detailed discussion, give a short answer and suggest posting it as a question on the site so others can help.
Answer in the language the user writes in. Write plain text, without Markdown formatting.`;

// limits so one request can't send a huge conversation
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

// converts the chat messages to Gemini's format, Gemini calls the assistant "model"
function parseMessages(body: unknown): Content[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const recent = messages.slice(-MAX_MESSAGES);
  const result: Content[] = [];
  for (const m of recent) {
    if (
      (m?.role !== "user" && m?.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.trim() === "" ||
      m.content.length > MAX_MESSAGE_LENGTH
    )
      return null;
    result.push({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] });
  }
  // the conversation has to start and end with the user
  while (result.length > 0 && result[0].role !== "user") result.shift();
  if (result.length === 0 || result[result.length - 1].role !== "user") return null;
  return result;
}

// Checks the Firebase ID token the browser sends, so only logged in users can use the chat.
// Firebase's accounts:lookup only returns a user for a valid, unexpired token.
async function isLoggedIn(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization");
  const idToken = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!idToken) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.users) && data.users.length > 0;
  } catch (error) {
    console.error("Can't verify the login token:", error);
    return false;
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    console.error(`Gemini API error ${error.status}:`, error.message);
    if (error.status === 429)
      return "I'm getting too many questions right now, please try again in a minute.";
    if (error.status === 400 || error.status === 401 || error.status === 403)
      return "The chat isn't configured correctly.";
  } else {
    console.error(error);
  }
  return "Something went wrong, please try again.";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Add it to .env.local and restart the dev server.");
    return Response.json({ error: "The chat isn't configured yet." }, { status: 500 });
  }

  if (!(await isLoggedIn(request))) {
    return Response.json({ error: "You must be logged in to use the chat." }, { status: 401 });
  }

  const contents = parseMessages(await request.json().catch(() => null));
  if (!contents) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });
  // stops generating when the user closes the page or the request
  const abortController = new AbortController();

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      let answered = false;
      try {
        const response = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: { systemInstruction: SYSTEM_PROMPT, abortSignal: abortController.signal },
        });
        for await (const chunk of response) {
          if (chunk.text) {
            answered = true;
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        // Gemini returns no text when it blocks a question for safety reasons
        if (!answered) {
          controller.enqueue(encoder.encode("Sorry, I can't help with that question."));
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          controller.enqueue(encoder.encode(`${answered ? "\n\n" : ""}${errorMessage(error)}`));
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed because the request was cancelled
        }
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
