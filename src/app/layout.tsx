"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import "@/theme/theme.css";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "@/components/Navbar";
import "primeicons/primeicons.css";
import Footer from "@/components/Footer";
import { AuthContextProvider } from "./context/AuthContext";
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from "react";
import { measureMemory } from "vm";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showAiChat,SetShowAiChat] = useState<Boolean>(false);
  const [isMymessage, SetIsMymessage] = useState<Boolean>(true);
  const [message, SetMessage] = useState<string>("");
  const [messages,SetMessages] = useState<Message[]>([])

  type Message = {
    text: string;      // The content of the message
    isUserMessage: Boolean; // True if it's the user's message, false if it's the machine's message
  };
  function manageAIChat()
  {
    SetShowAiChat(!showAiChat);
  }
  function checkForEnterKey(event : React.KeyboardEvent<HTMLInputElement>)
  {
    if(event.key === 'Enter')
    {
      SetMessages((pmessages) => [...pmessages,{text: message, isUserMessage:isMymessage}])
      SetMessage("")
      SetIsMymessage(!isMymessage);
      console.log(isMymessage)
    }
  }
  useEffect(() =>{

  },[messages] )
  return (
    <PrimeReactProvider>
      <html lang="en">
        <title>Learn in team</title>
        <link
          rel="icon"
          href="./favicon/favicon.ico"
          type="image/x-icon"
          sizes="400x400"
        />
        <AuthContextProvider>
          <body className={`${inter.className} `}>
            <Navbar></Navbar>
            {children}
            <div className="flex  justify-center items-center w-14 aspect-square bg-purple-400 rounded-full fixed bottom-14 right-14 cursor-pointer" onClick={manageAIChat} >
              <i className="pi pi-comment -scale-x-100" style={{fontSize: '25px', color:"white"}}></i>
            </div>
            {
              showAiChat
              ?
              <div className="flex flex-col justify-between fixed bottom-14 right-28 w-60 h-96 mr-3 rounded-md bg-purple-200 overflow-hidden">
                <div className=" w-full bg-purple-600 px-4 py-2 text-white font-bold">
                  Chat with AI
                </div>
                <div className="flex flex-col h-full w-full overflow-y-scroll">
                {messages.map((q) => (
                  q.isUserMessage
                  ?
                  <div className="self-end">
                    {q.text}
                  </div>
                  :
                  <div className="self-start">
                    {q.text}
                  </div>
                ))}
                </div>
                <InputText value={message} onChange={(e) => SetMessage(e.target.value)} onKeyDown={(e) => checkForEnterKey(e)} />
              </div>
              :
              <></>
            }
            <Footer></Footer>
          </body>
        </AuthContextProvider>
      </html>
    </PrimeReactProvider>
  );
}
