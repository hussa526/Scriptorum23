import React, { createContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null); // Store userId as string or null

  useEffect(() => {
    // Check if a token and userId exists in localStorage
    const token = localStorage.getItem("userToken");
    const savedUserId = localStorage.getItem("userId");

    if (token && savedUserId) {
      setIsAuthenticated(true);
      setUserId(savedUserId); // Set userId as string
    }
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userId", userId); // Store userId as string in localStorage
    setIsAuthenticated(true);
    setUserId(userId); // Set userId as string
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId"); // Remove userId from localStorage
    setIsAuthenticated(false);
    setUserId(null); // Reset userId to null
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
