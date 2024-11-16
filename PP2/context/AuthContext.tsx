import React, { createContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null; // Add username
  avatar: string | null;
  token: string | null;
  login: (token: string, userId: string, username: string, avatar: string) => void; // Include username in login
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // State for username
  const [avatar, setAvatar] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for token, userId, and username in localStorage
    const token = localStorage.getItem("userToken");
    const savedUserId = localStorage.getItem("userId");
    const savedUsername = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("avatar");

    if (token && savedUserId && savedUsername && savedAvatar) {
      setIsAuthenticated(true);
      setUserId(savedUserId);
      setUsername(savedUsername);
      setAvatar(savedAvatar); // Set avatar
      setToken(token);
    }
  }, []);

  const login = (token: string, userId: string, username: string, avatar: string) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username); // Store username in localStorage
    localStorage.setItem("avatar", avatar); // Save avatar URL
    setIsAuthenticated(true);
    setUserId(userId);
    setUsername(username);
    setAvatar(avatar);
    setToken(token);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      // Only access localStorage on the client-side
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username"); // Remove username from localStorage
      localStorage.removeItem("avatar");
    }
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
    setAvatar(null);
    setToken(null);
  };

  // logout();

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username, avatar, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
