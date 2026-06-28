"use client";

import {
  useContext,
  useEffect,
  useState,
  createContext,
  ReactNode,
} from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../firebase";
const AuthContext = createContext<any>(null);
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import IUser from "../../../functions/src/interfaces/IUser";
import axios from "axios";
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [userInfos, setUserInfos] = useState<IUser>();
  const router = useRouter();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // setUserInfos(
      //   axios.get("/api/users/" + currentUser?.uid)

      // );
      if (user) {
        router.push("/profile");
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
