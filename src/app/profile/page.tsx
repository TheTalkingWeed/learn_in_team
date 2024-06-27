"use client";

import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import LoadingAnimation from "@/components/LoadingAnimation";
import axios from "axios";
import IUser from "../../../functions/src/interfaces/IUser";
export default function page() {
  const {user} = UserAuth();
  const [loading, setLoading] = useState(true);
  const [loggedInUser,setLoggedInUser] = useState<IUser>()


  
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  function getUserInformation(email : string) : IUser | any{
    axios.get("/app/api/user_by_email/" + email).then((res) => {
      const data = res.data
      return data
    }).catch((err) => {
      console.log("Error, cant get user")
    }).finally(() => {return null})
  }
  return (
    <div className="min-h-screen bg-purple-100">
      {loading ? (
        <div className="flex flex-col w-full p-5 justify-center items-center">
          <LoadingAnimation/>
        </div>
      ) : user ? (
        <div className="flex flex-col w-[90%] m-auto p-28">
           <TabView>
                <TabPanel header="Profile informations">
                    <p className="m-0">
                        {user.email ? getUserInformation(user.email) : <></>}
                    </p>
                </TabPanel>
                <TabPanel header="Your questions">
                    
                </TabPanel>
            </TabView>
        </div>
      ) : (
        <h1>You must be logged in to view this page</h1>
      )}
    </div>
  );
}
