import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
export default function Navbar() {
  return (
    <div className="h-20 bg-gray-800 w-full flex flex-row justify-between items-center px-12">
      <div>
        <Link
          href="/"
          className="text-3xl font-bold text-white tracking-widest"
        >
          CoopLearn
        </Link>
      </div>
      <div className=" flex flex-row h-11">
        <div className=" flex flex-row gap-x-5 items-center ">
          <Link
            href="/about"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            About
          </Link>
          <Link
            href="/ask-a-question"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            Ask a question
          </Link>
          <Link
            href="/topics"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            Topics
          </Link>
        </div>
        <span className="p-input-icon-left mx-10 w-72">
          <i className="pi pi-search" />
          <InputText placeholder="Search" className="p-inputtext-sm w-full" />
        </span>
        <div className="flex flex-row gap-x-5">
          <Link
            href="/login"
            className="w-24 h-11 px-4 py-2 text-center font-bold bg-slate-100 text-gray-800 rounded-lg cursor-pointer hover:bg-slate-200 duration-300 "
          >
            Log in
          </Link>
          <Link
            href="/registration"
            className="w-24 h-11 px-4 py-2 text-center font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300 "
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
