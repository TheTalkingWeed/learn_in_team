"use client";

import React, { useState } from "react";
import "../../styles/registration.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import Link from "next/link";
export default function page() {
  const [firstname, setFirstName] = useState<string>();
  const [lastname, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordAgain, setPasswordAgain] = useState<string>();
  const [school, setSchool] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [profession, setProfession] = useState<string>();
  const [agreed, setAgreed] = useState<boolean>(false);

  const titles: Array<string> = ["Student", "Professor", "Doctor"];
  const professions: Array<string> = [
    "Doctor",
    "Teacher",
    "Engineer",
    "Lawyer",
    "Accountant",
    "Nurse",
    "Architect",
    "Chef",
    "Artist",
    "Writer",
    "Scientist",
    "Pilot",
    "Electrician",
    "Salesperson",
  ];

  return (
    <div className="w-full min-h-screen bg-purple-100 flex flex-col items-center pt-20">
      <Card title="Sign in" className="w-fit">
        <div className="flex flex-row gap-x-5 mb-5">
          <InputText
            placeholder="First name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputText
            placeholder="Last name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <InputText
          placeholder="Email"
          type="email"
          className="mb-5"
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputText
          placeholder="Password"
          type="password"
          className="mb-5"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputText
          placeholder="Password again"
          type="password"
          className="mb-5"
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <InputText
          placeholder="School"
          type="text"
          className="mb-5"
          onChange={(e) => setSchool(e.target.value)}
        />
        <Dropdown
          value={title}
          options={titles}
          className="mb-5"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Dropdown
          value={profession}
          options={professions}
          placeholder="Your main profession"
          className="mb-5"
          onChange={(e) => setProfession(e.target.value)}
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

        <Button label="Log in" className="mb-9" />

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
