"use client";

import React, { useEffect, useRef, useState } from "react";
import "../../styles/registration.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import IUser from "../../../functions/src/interfaces/IUser";
export default function page() {
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);
  const [bornDate, setBornDate] = useState<Nullable<Date>>(null);
  const [gender, setGender] = useState<string>("");
  const [longEnough, setLongEnough] = useState<boolean>(false);
  const [hasUppercase, setHasUppercase] = useState<boolean>(false);
  const [hasLowercase, setHasLowercase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const titles: Array<string> = ["Student", "Teacher"];
  const genders: Array<string> = ["Male", "Female"];
  const toast = useRef<Toast>(null);
  const today: Date = new Date();
  const authEP = getAuth();

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
      showError("Please fill all fields!");
    } else if (usernameExits(username)) {
      showError("Username already exists.");
    } else if (bornDate && bornDate.getTime() > today.getTime()) {
      showError("Invalid born date.");
    } else if (password !== passwordAgain) {
      showError("Passwords does't match.");
    } else if (!isValidEmail(email)) {
      showError("Email is not valid.");
    } else if (!agreed) {
      showError("Please agree to the terms and conditions.");
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
            .then((res) => {
              console.log(res);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          if (errorCode === "auth/email-already-in-use")
            showError("Email already in use.");
          else if (errorCode === "auth/invalid-email")
            showError("Invalid email.");
          else if (errorCode === "auth/weak-password")
            showError("Password is too weak.");
        });
    }
  };

  useEffect(() => {
    checkPassword(password);
  }, [password]);

  function checkPassword(password: string) {
    if (password.length >= 8) setLongEnough(true);
    else setLongEnough(false);

    if (password.match(/[A-Z]/)) setHasUppercase(true);
    else setHasUppercase(false);

    if (password.match(/[a-z]/)) setHasLowercase(true);
    else setHasLowercase(false);

    if (password.match(/[0-9]/)) setHasNumber(true);
    else setHasNumber(false);
  }

  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col items-center py-20">
      <Toast ref={toast} />
      <Card title="Create an account" className="w-fit">
        <div className="flex flex-row gap-x-5 mb-5">
          <InputText
            required
            placeholder="First name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputText
            required
            placeholder="Last name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <InputText
          required
          placeholder="Username"
          type="text"
          className="mb-5"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Calendar
          className="mb-5"
          placeholder="Borndate"
          value={bornDate}
          onChange={(e) => setBornDate(e.value)}
        />
        <InputText
          required
          placeholder="Email"
          type="email"
          className="mb-5"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col group">
          <InputText
            required
            placeholder="Password"
            type="password"
            className="mb-5"
            onChange={(e) => setPassword(e.target.value)}
          />
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
                1 Number letter
              </li>
            </ul>
          </div>
        </div>
        <InputText
          required
          placeholder="Password again"
          type="password"
          className="mb-5"
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <Dropdown
          value={title}
          options={titles}
          className="mb-5"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Dropdown
          value={gender}
          options={genders}
          className="mb-5"
          placeholder="Gender"
          onChange={(e) => setGender(e.target.value)}
        />

        <div className="flex flex-row ">
          <Checkbox
            inputId="agree"
            checked={agreed}
            onChange={(e) => setAgreed(!agreed)}
          />
          <label htmlFor="agree" className="ml-2 mb-5 cursor-pointer">
            Agree the terms and conditions
          </label>
        </div>

        <Button label="Sign up" className="mb-9" onClick={() => signup()} />

        <Link
          href="/login"
          className=" w-fit mx-auto text-sky-600 hover:text-sky-500 cursor-pointer underline "
        >
          Already have an account?
        </Link>
      </Card>
    </div>
  );
}
