"use client";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { auth } from "../firebase";
export default function page() {
  const [email, setEmail] = useState<string>("");
  const toast = useRef<Toast>(null);

  const showMessage = (mess: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: mess,
      life: 3000,
    });
  };
  function handleSubmit() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMessage("Password reset email sent.");
        setEmail("");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center  bg-purple-50  ">
      <Toast ref={toast} />
      <Card title="Type your E-mail" className="flex flex-col mt-32">
        <InputText
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-96 mb-4"
        />
        <Button
          label="Send email"
          className="w-48 mx-auto"
          onClick={handleSubmit}
        />
      </Card>
    </div>
  );
}
