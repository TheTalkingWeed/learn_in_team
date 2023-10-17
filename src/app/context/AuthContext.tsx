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
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
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
