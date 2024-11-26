import { useState, useContext } from "react";
import { useRouter } from "next/router";

import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();

  const auth = useContext(AuthContext);

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
			throw new Error("Invalid username or password.");
		}

		const result = await response.json();
		console.log(result);
		// Save user info to localStorage
		// localStorage.setItem("userToken", result.token); // Example, adjust as needed
		// localStorage.setItem("userId", result.id.toString()); // Ensure userId is a string
		// localStorage.setItem("username", result.username);
		// localStorage.setItem("avatar", result.avatar);

		auth?.login(result.token, result.id.toString(), result.username, result.avatar, result.role);

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
				<Link href="/user/create" className="text-blue-500 hover:underline">
					Sign up
				</Link>
			</p>
			</div>
		</div>
	);
};

export default LoginPage;
