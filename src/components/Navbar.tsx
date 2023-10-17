import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { UserAuth } from "@/app/context/AuthContext";
export default function Navbar() {
  const { user, logOut } = UserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-20 bg-gray-800 w-full flex flex-row justify-between items-center px-12">
      <div className="">
        <Link
          href="/"
          className="text-3xl font-bold text-white tracking-widest flex flex-row items-center"
        >
          <Image src={logo} alt="logo" width={50} className="cursor-pointer" />
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
          {user ? (
            <div className="flex flex-row justify-center gap-x-5">
              <Link
                href="/profile"
                className=" flex justify-center items-center aspect-square m-auto p-3 bg-white rounded-full"
              >
                <i
                  className="pi pi-user text-white cursor-pointer "
                  style={{ fontSize: "1rem", color: "black" }}
                />
              </Link>
              <button
                onClick={handleLogOut}
                className="w-24 h-11 px-4 py-2 text-center font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-slate-200 duration-300 "
              >
                Log out
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
