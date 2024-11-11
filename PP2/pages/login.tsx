// login.tsx
// Created by ChatGPT for user login page functionality in a Single Page Application (SPA)

import { useState } from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Manage login state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userCredentials = { username, password };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or error logging in.");
      }

      const result = await response.json();
      // Save user info to localStorage/sessionStorage or cookie
      localStorage.setItem("userToken", result.token); // Example, adjust as needed

      // Set login state in the current page (SPA)
      setIsLoggedIn(true);

      // Redirect to the home screen after successful login
      router.push("/"); // Redirect to the homepage or landing page
    } catch (err: any) {
      setError(err.message || "Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isLoggedIn ? (
        // Show login form when user is not logged in
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-semibold text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      ) : (
        // Optionally show success message or redirect if logged in
        <div className="text-center">
          <p className="text-green-500">You are logged in!</p>
          <a href="/" className="text-blue-500 hover:underline">
            Go to Home Page
          </a>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
