import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (name: string, email: string) => {
    try {
      await api.auth.login(name, email);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const checkCookie = () => {
      if (typeof document === "undefined") {
        return;
      }

      const cookieString = document.cookie;
      const cookies = cookieString.split(";");
      let foundCookie = false;

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("fetch-access-token" + "=")) {
          foundCookie = true;
          break;
        }
      }

      setIsLoggedIn(foundCookie);
    };

    checkCookie();
  }, []);

  return {
    isLoggedIn,
    login,
    logout,
  };
};
