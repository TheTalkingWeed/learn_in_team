"use client";

import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
export default function page() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);
  console.log(user);
  return (
    <div className="min-h-screen bg-purple-100">
      {loading ? (
        <>pill</>
      ) : user ? (
        <div className="flex flex-col">
          <img src={user.photoURL} className="w-20 aspect-square" alt="pfp" />
          <h1>{user.displayName}</h1>
          <h1>{user.email}</h1>
        </div>
      ) : (
        <h1>You must be logged in to view this page</h1>
      )}
    </div>
  );
}
