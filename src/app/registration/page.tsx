"use client";

import React, { useEffect, useRef, useState } from "react";
import "../../styles/registration.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import IUser from "../../../functions/src/interfaces/IUser";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import FieldError from "@/components/FieldError";
export default function Page() {
  const { refreshUserInfos } = UserAuth();
  const router = useRouter();
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [bornDate, setBornDate] = useState<Nullable<Date>>(null);
  const [gender, setGender] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  // password checklist, calculated from the password on every render
  const longEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const titles: Array<string> = ["Student", "Teacher"];
  const genders: Array<string> = ["Male", "Female"];
  const toast = useRef<Toast>(null);
  const today: Date = new Date();

  const [users, setUsers] = useState<Array<IUser>>([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      const data: Array<IUser> = res.data;
      setUsers(data);
    });
  }, []);

  const showError = (mess: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mess,
      life: 3000,
    });
  };

  function usernameExits(username: string): boolean {
    let result: boolean = false;

    users.forEach((element) => {
      if (element.username === username) result = true;
    });
    console.log(result);
    return result;
  }

  function isValidEmail(email: string): boolean {
    let res: boolean = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    res = emailRegex.test(email);

    return res;
  }

  const signup = () => {
    // from now on the empty fields show their error message
    setSubmitted(true);
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !passwordAgain ||
      !title ||
      !gender
    ) {
      return;
    }
    if (usernameExits(username)) {
      showError("Username already exists.");
    } else if (bornDate && bornDate.getTime() > today.getTime()) {
      showError("Invalid born date.");
    } else if (password !== passwordAgain) {
      showError("Passwords does't match.");
    } else if (!isValidEmail(email)) {
      showError("Email is not valid.");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((uc) => {
          const user = uc.user;
          axios
            .post("/api/users", {
              id: user.uid,
              email: email,
              first_name: firstname,
              last_name: lastname,
              username: username,
              title: title,
              gender: gender,
              born_date: bornDate,
            })
            .then(async () => {
              // the auth listener ran before this document existed, so load it now
              await refreshUserInfos();
              router.push("/profile");
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          const errorCode = err.code;
          if (errorCode === "auth/email-already-in-use")
            showError("Email already in use.");
          else if (errorCode === "auth/invalid-email")
            showError("Invalid email.");
          else if (errorCode === "auth/weak-password")
            showError("Password is too weak.");
        });
    }
  };


  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col items-center px-4 py-10 sm:py-20 gap-1">
      <Toast ref={toast} />
      <Card title="Create an account" className="w-full max-w-lg animate-fade-in-up">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-5">
            <div className="flex flex-col gap-1 w-full">
              <InputText
                required
                placeholder="First name"
                type="text"
                className="w-full"
                invalid={submitted && !firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FieldError show={submitted && !firstname} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <InputText
                required
                placeholder="Last name"
                type="text"
                className="w-full"
                invalid={submitted && !lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
              <FieldError show={submitted && !lastname} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <InputText
              required
              placeholder="Username"
              type="text"
              invalid={submitted && !username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FieldError show={submitted && !username} />
          </div>
          <Calendar
            className=""
            placeholder="Borndate"
            value={bornDate}
            onChange={(e) => setBornDate(e.value)}
          />
          <div className="flex flex-col gap-1">
            <InputText
              required
              placeholder="Email"
              type="email"
              invalid={submitted && !email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldError show={submitted && !email} />
          </div>
          <div className="flex flex-col gap-1 group">
            <Password
              required
              placeholder="Password"
              className="w-full"
              inputClassName="w-full"
              value={password}
              invalid={submitted && !password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
            />
            <FieldError show={submitted && !password} />
            <div className="hidden group-focus-within:block mb-3">
              <h1 className="font-bold">Your password must contain:</h1>
              <ul className="ml-4">
                <li>
                  <i
                    className={`${
                      longEnough ? "pi pi-check" : "pi pi-times"
                    } mr-3 `}
                    style={{
                      color: longEnough ? "green" : "red",
                      fontWeight: 700,
                    }}
                  ></i>
                  Minimum 8 characters
                </li>
                <li>
                  <i
                    className={`${
                      hasUppercase ? "pi pi-check" : "pi pi-times"
                    } mr-3`}
                    style={{
                      color: hasUppercase ? "green" : "red",
                      fontWeight: 700,
                    }}
                  ></i>
                  1 Upercase letter
                </li>
                <li>
                  <i
                    className={`${
                      hasLowercase ? "pi pi-check" : "pi pi-times"
                    } mr-3`}
                    style={{
                      color: hasLowercase ? "green" : "red",
                      fontWeight: 700,
                    }}
                  ></i>
                  1 Lowercase letter
                </li>
                <li>
                  <i
                    className={`${
                      hasNumber ? "pi pi-check" : "pi pi-times"
                    } mr-3`}
                    style={{
                      color: hasNumber ? "green" : "red",
                      fontWeight: 700,
                    }}
                  ></i>
                  1 Number
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Password
              required
              placeholder="Password again"
              className="w-full"
              inputClassName="w-full"
              value={passwordAgain}
              invalid={submitted && !passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              feedback={false}
              toggleMask
            />
            <FieldError show={submitted && !passwordAgain} />
          </div>

          <div className="flex flex-col gap-1">
            <Dropdown
              value={title}
              options={titles}
              placeholder="Title"
              invalid={submitted && !title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FieldError show={submitted && !title} />
          </div>
          <div className="flex flex-col gap-1">
            <Dropdown
              value={gender}
              options={genders}
              placeholder="Gender"
              invalid={submitted && !gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <FieldError show={submitted && !gender} />
          </div>

          {/* <div className="flex align-items-center">
            <Checkbox
              inputId="agree"
              checked={agreed}
              onChange={(e) => setAgreed(!agreed)}
            />
            <label htmlFor="agree" className="ml-2  cursor-pointer">
              Agree the terms and conditions
            </label>
          </div> */}
          <Button label="Sign up" className="mb-9" onClick={() => signup()} />
          <Link
            href="/login"
            className=" w-fit mx-auto text-sky-600 hover:text-sky-500 cursor-pointer underline "
          >
            Already have an account?
          </Link>
        </div>
      </Card>
    </div>
  );
}
