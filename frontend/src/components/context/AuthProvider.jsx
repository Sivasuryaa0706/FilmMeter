import React, { createContext, useState } from "react";
import { signInUser } from "../../api/auth";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signInUser({ email, password });

    if (error) {
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    //if no error
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;
  };
  // handleLogout, isAuth
  return (
    <AuthContext.Provider value={{ authInfo, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
