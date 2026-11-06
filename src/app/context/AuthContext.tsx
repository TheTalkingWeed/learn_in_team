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
  User,
} from "firebase/auth";

import { auth } from "../firebase";
import IUser from "../../../functions/src/interfaces/IUser";
import axios from "axios";

interface IAuthContext {
  user: User | null; // Firebase auth user
  userInfos: IUser | null; // user data from our database
  loading: boolean; // true until Firebase restored the session and userInfos is loaded
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshUserInfos: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

async function fetchUserInfos(uid: string): Promise<IUser | null> {
  try {
    const res = await axios.get(`/api/users/${uid}`, { timeout: 10000 });
    return res.data ? (res.data as IUser) : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfos, setUserInfos] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  // Reloads userInfos, e.g. after registration created the user document
  const refreshUserInfos = async () => {
    if (auth.currentUser) setUserInfos(await fetchUserInfos(auth.currentUser.uid));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      setUserInfos(currentUser ? await fetchUserInfos(currentUser.uid) : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userInfos, loading, googleSignIn, logOut, refreshUserInfos }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("UserAuth must be used inside AuthContextProvider");
  return context;
};
