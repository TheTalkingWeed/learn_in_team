"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import React, { useRef, useState } from "react";
import "../../styles/login.css";
import { UserAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Toast } from "primereact/toast";
import Link from "next/link";

export default function login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const { googleSignIn } = UserAuth();
  const auth = getAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.log(err);
    }
  };
  const showError = (mess: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mess,
      life: 3000,
    });
  };
  function handleSignIn() {
    console.log("asd");
    if (email && password)
      signInWithEmailAndPassword(auth, email, password)
        .then((uc) => {
          const user = uc.user;
          console.log(user.uid);
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorCode, errorMessage);
          if (errorCode === "auth/invalid-email") {
            showError("Invalid email address.");
          } else if (errorCode === "auth/invalid-login-credentials") {
            showError("Invalid password or email.");
          }
        });
  }

  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col items-center py-20">
      <Toast ref={toast} />
      <Card title="Login" className="w-[500px]">
        <span className="p-input-icon-left w-full mb-7">
          <i className="pi pi-at" />
          <InputText
            placeholder="Email"
            className="w-full"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
        <span className="p-input-icon-left w-full mb-7">
          <i className="pi pi-eye" />
          <InputText
            placeholder="Password"
            className="w-full"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </span>
        <div className="flex flex-row  w-fit mb-7">
          <Checkbox
            inputId="stayLogged"
            checked={stayLoggedIn}
            onChange={(e) => setStayLoggedIn(!stayLoggedIn)}
          />
          <label htmlFor="stayLogged" className="ml-2 cursor-pointer">
            Stay logged in
          </label>
        </div>
        <Button
          label="Log in"
          className="mb-4"
          onClick={() => handleSignIn()}
        />
        <div className="w-full flex flex-col justify-center items-center mb-5">
          <p>or Login with</p>
          <div className="flex flex-row my-2 gap-x-3">
            {" "}
            <i
              className="pi pi-google cursor-pointer "
              onClick={handleGoogleSignIn}
            />
            <i className="pi pi-facebook cursor-pointer" />
            <i className="pi pi-github cursor-pointer" />
          </div>
        </div>
        <h1 className=" w-fit mx-auto text-sky-600 hover:text-sky-500 cursor-pointer underline ">
          <Link href="/forgotpassword">Forgot your password?</Link>
        </h1>
      </Card>
    </div>
  );
}
