"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { Password } from "primereact/password";
import React, { useRef, useState } from "react";
import "../../styles/login.css";
import { UserAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Toast } from "primereact/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FieldError from "@/components/FieldError";

export default function Page() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const { googleSignIn } = UserAuth();
  const auth = getAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/profile");
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
    // from now on the empty fields show their error message
    setSubmitted(true);
    if (email && password)
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.push("/profile");
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
    <div className="w-full min-h-screen bg-purple-100 flex flex-col items-center px-4 py-10 sm:py-20">
      <Toast ref={toast} />
      <Card title="Login" className="w-full max-w-[500px] animate-fade-in-up">
        <div className="flex flex-col gap-1 mb-7">
          <IconField iconPosition="left" className="w-full">
            <InputText
              placeholder="Email"
              className="w-full"
              type="email"
              invalid={submitted && !email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </IconField>
          <FieldError show={submitted && !email} />
        </div>
        <div className="flex flex-col gap-1 mb-7">
          <IconField iconPosition="left" className="w-full">
            <Password
              placeholder="Password"
              className="w-full"
              inputClassName="w-full !pl-10"
              value={password ?? ""}
              invalid={submitted && !password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
            />
          </IconField>
          <FieldError show={submitted && !password} />
        </div>
        {/* <div className="flex flex-row  w-fit mb-7">
          <Checkbox
            inputId="stayLogged"
            checked={stayLoggedIn}
            onChange={(e) => setStayLoggedIn(!stayLoggedIn)}
          />
          <label htmlFor="stayLogged" className="ml-2 cursor-pointer">
            Stay logged in
          </label>
        </div> */}
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
          </div>
        </div>
        <h1 className=" w-fit mx-auto text-sky-600 hover:text-sky-500 cursor-pointer underline ">
          <Link href="/forgotpassword">Forgot your password?</Link>
        </h1>
      </Card>
    </div>
  );
}
