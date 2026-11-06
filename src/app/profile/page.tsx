"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import { TabView, TabPanel } from "primereact/tabview";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import LoadingAnimation from "@/components/LoadingAnimation";
import ProfilePictureEditor from "@/components/ProfilePictureEditor";
import ProfileDetails from "@/components/ProfileDetails";
import UserQuestions from "@/components/UserQuestions";

export default function Page() {
  const { user, userInfos, loading, refreshUserInfos } = UserAuth();
  const [pictureEditorVisible, setPictureEditorVisible] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  async function savePicture(picture: string) {
    if (!user) return;
    await axios.put(`/api/users/${user.uid}`, {
      email: user.email,
      profile_picture: picture,
    });
    await refreshUserInfos();
    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: picture ? "Profile picture updated." : "Profile picture removed.",
      life: 3000,
    });
  }

  if (loading)
    return (
      <div className="min-h-screen bg-purple-100 flex justify-center p-10">
        <LoadingAnimation />
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-purple-100 flex flex-col items-center gap-4 p-20">
        <i className="pi pi-lock text-purple-400" style={{ fontSize: "3rem" }} />
        <h1 className="text-2xl font-bold">You must be logged in to view this page</h1>
        <Link href="/login">
          <Button label="Log in" />
        </Link>
      </div>
    );

  const fullName = userInfos
    ? `${userInfos.first_name} ${userInfos.last_name}`
    : user.displayName ?? user.email;
  const initials = userInfos
    ? `${userInfos.first_name?.[0] ?? ""}${userInfos.last_name?.[0] ?? ""}`
    : (user.email?.[0] ?? "?");

  return (
    <div className="min-h-screen bg-purple-100 py-6 sm:py-10 px-4">
      <Toast ref={toast} />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
        <div className="h-28 sm:h-36 bg-linear-to-r from-purple-700 via-purple-500 to-fuchsia-400" />

        <div className="px-4 sm:px-8 pb-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5 -mt-12">
          <div className="relative w-fit animate-scale-in [animation-delay:150ms] [animation-duration:0.4s]">
            <Avatar
              image={userInfos?.profile_picture || undefined}
              label={userInfos?.profile_picture ? undefined : initials.toUpperCase()}
              shape="circle"
              className="w-24! h-24! sm:w-32! sm:h-32! text-3xl! sm:text-4xl! bg-purple-200! text-purple-700! ring-4 ring-white shadow-md"
            />
            <button
              onClick={() => setPictureEditorVisible(true)}
              className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              title="Edit profile picture"
            >
              <i className="pi pi-camera" />
            </button>
          </div>
          <div className="flex flex-col gap-1 pb-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 wrap-break-word">{fullName}</h1>
            <div className="flex flex-row flex-wrap items-center gap-3 text-gray-500">
              {userInfos?.username && <span>@{userInfos.username}</span>}
              {userInfos?.title && (
                <Tag value={userInfos.title} className="bg-purple-100 text-purple-700" />
              )}
            </div>
          </div>
        </div>

         <TabView className="px-1 sm:px-4 pb-6" scrollable>
          <TabPanel header="Profile information" leftIcon="pi pi-user mr-2">
            <div className="p-2 sm:p-4">
              <ProfileDetails user={user} userInfos={userInfos} onSaved={refreshUserInfos} />
            </div>
          </TabPanel>
          <TabPanel header="Your questions" leftIcon="pi pi-comments mr-2">
            <div className="p-2 sm:p-4">
              <UserQuestions userId={user.uid} />
            </div>
          </TabPanel>
        </TabView> 
        
      </div>

      {/* only mounted while open, so every opening starts fresh */}
      {pictureEditorVisible && (
        <ProfilePictureEditor
          visible={pictureEditorVisible}
          currentPicture={userInfos?.profile_picture}
          onHide={() => setPictureEditorVisible(false)}
          onSave={savePicture}
        />
      )}
    </div>
  );
}
