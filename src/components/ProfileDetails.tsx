"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { User } from "firebase/auth";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Nullable } from "primereact/ts-helpers";
import IUser from "../../functions/src/interfaces/IUser";
import FieldError from "./FieldError";

const titles: Array<string> = ["Student", "Teacher"];
const genders: Array<string> = ["Male", "Female"];

interface Props {
  user: User;
  userInfos: IUser | null;
  onSaved: () => Promise<void>;
}

function formatDate(date?: Date | string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Field({
  label,
  missing = false,
  children,
}: {
  label: string;
  missing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
      <FieldError show={missing} />
    </div>
  );
}

export default function ProfileDetails({ user, userInfos, onSaved }: Props) {
  const toast = useRef<Toast>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [bornDate, setBornDate] = useState<Nullable<Date>>(null);
  // set by the first save attempt, from then on the empty fields show their error message
  const [submitted, setSubmitted] = useState<boolean>(false);

  function resetFields() {
    setSubmitted(false);
    setFirstName(userInfos?.first_name ?? "");
    setLastName(userInfos?.last_name ?? "");
    setUsername(userInfos?.username ?? "");
    setTitle(userInfos?.title ?? "");
    setGender(userInfos?.gender ?? "");
    setBornDate(userInfos?.born_date ? new Date(userInfos.born_date) : null);
  }

  // fill the form with the current data when editing starts
  function startEditing() {
    resetFields();
    setEditing(true);
  }

  const showError = (mess: string) => {
    toast.current?.show({ severity: "error", summary: "Error", detail: mess, life: 3000 });
  };

  async function usernameTaken(name: string): Promise<boolean> {
    const res = await axios.get("/api/users");
    const users: Array<IUser> = res.data;
    return users.some((u) => u.username === name && u.id !== user.uid);
  }

  async function save() {
    setSubmitted(true);
    if (!firstname || !lastname || !username || !title || !gender) return;
    if (bornDate && bornDate.getTime() > new Date().getTime()) {
      showError("Invalid born date.");
      return;
    }

    setSaving(true);
    try {
      if (await usernameTaken(username)) {
        showError("Username already exists.");
        return;
      }
      await axios.put(`/api/users/${user.uid}`, {
        email: user.email,
        first_name: firstname,
        last_name: lastname,
        username: username,
        title: title,
        gender: gender,
        born_date: bornDate ?? null,
      });
      await onSaved();
      setEditing(false);
      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "Your profile was updated.",
        life: 3000,
      });
    } catch (err) {
      console.log(err);
      showError("Can't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    resetFields();
    setEditing(false);
  }

  const valueClass = "text-lg text-gray-800 min-h-[2.75rem] flex items-center";

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Toast ref={toast} />

      <div className="flex flex-row justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Personal information</h2>
          {!userInfos && (
            <p className="text-sm text-gray-500 mt-1">
              Your profile isn&apos;t complete yet. Fill in your details to finish it.
            </p>
          )}
        </div>
        {editing ? (
          <div className="flex flex-row gap-2">
            <Button label="Cancel" text onClick={cancel} disabled={saving} />
            <Button label="Save" icon="pi pi-check" loading={saving} onClick={save} />
          </div>
        ) : (
          <Button label="Edit" icon="pi pi-pencil" outlined onClick={startEditing} />
        )}
      </div>

      {/* the key remounts the fields when switching between view and edit, so they fade in */}
      <div key={editing ? "edit" : "view"} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 animate-fade-in [animation-duration:0.3s]">
        <Field label="First name" missing={editing && submitted && !firstname}>
          {editing ? (
            <InputText
              value={firstname}
              invalid={submitted && !firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
          ) : (
            <span className={valueClass}>{userInfos?.first_name || "-"}</span>
          )}
        </Field>
        <Field label="Last name" missing={editing && submitted && !lastname}>
          {editing ? (
            <InputText
              value={lastname}
              invalid={submitted && !lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
          ) : (
            <span className={valueClass}>{userInfos?.last_name || "-"}</span>
          )}
        </Field>
        <Field label="Username" missing={editing && submitted && !username}>
          {editing ? (
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-at" />
              <InputText
                className="w-full"
                value={username}
                invalid={submitted && !username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </IconField>
          ) : (
            <span className={valueClass}>{userInfos?.username || "-"}</span>
          )}
        </Field>
        <Field label="Email">
          {/* the email belongs to the login account, so it isn't editable here */}
          <span className={`${valueClass} text-gray-500`}>
            {user.email}
            {editing && <i className="pi pi-lock ml-2 text-sm" title="Can't be changed" />}
          </span>
        </Field>
        <Field label="Title" missing={editing && submitted && !title}>
          {editing ? (
            <Dropdown
              value={title}
              options={titles}
              placeholder="Title"
              invalid={submitted && !title}
              onChange={(e) => setTitle(e.value)}
            />
          ) : (
            <span className={valueClass}>{userInfos?.title || "-"}</span>
          )}
        </Field>
        <Field label="Gender" missing={editing && submitted && !gender}>
          {editing ? (
            <Dropdown
              value={gender}
              options={genders}
              placeholder="Gender"
              invalid={submitted && !gender}
              onChange={(e) => setGender(e.value)}
            />
          ) : (
            <span className={valueClass}>{userInfos?.gender || "-"}</span>
          )}
        </Field>
        <Field label="Born date">
          {editing ? (
            <Calendar
              value={bornDate}
              onChange={(e) => setBornDate(e.value)}
              maxDate={new Date()}
              showIcon
              placeholder="Born date"
            />
          ) : (
            <span className={valueClass}>{formatDate(userInfos?.born_date)}</span>
          )}
        </Field>
      </div>
    </div>
  );
}
