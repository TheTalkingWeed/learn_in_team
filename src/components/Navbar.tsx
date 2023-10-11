import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
export default function Navbar() {
  return (
    <div className="h-20 bg-gray-800 w-full flex flex-row justify-between items-center px-12">
      <div>
        <Link href="/" className="text-3xl font-bold text-white">
          CoopLearn
        </Link>
      </div>
      <div className=" flex flex-row h-11">
        <div className=" flex flex-row gap-x-5 items-center mr-10">
          <Link
            href="/about"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            About
          </Link>
          <Link
            href="/community"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            Community
          </Link>
          <Link
            href="/topics"
            className=" text-white text-lg hover:text-slate-400 duration-300"
          >
            Topics
          </Link>
        </div>
        <div className="flex flex-row gap-x-5">
          <button className="w-24 h-12 px-4 py-2 font-bold bg-slate-100 text-gray-800 rounded-lg cursor-pointer hover:bg-slate-200 duration-300 ">
            Log in
          </button>
          <button className="w-24 h-12 px-4 py-2 font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300 ">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
