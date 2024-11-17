import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link"; // Import Link for navigation

import { Template } from "@/interface/Template";

export default function UserAccount() {
  const auth = useContext(AuthContext);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(auth);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (auth?.userId && auth?.token) {
        try {
          // Replace with your actual API endpoint for fetching user templates
          const response = await fetch(`/api/template/user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch templates");
          }

          const data = await response.json();
          console.log(data);
          setTemplates(data.templates); // Set fetched templates to state
          setLoading(false);   // Set loading to false after data is fetched
        } catch (error) {
          console.error("Error fetching templates:", error);
          setLoading(false); // Set loading to false in case of an error
        }
      }
    };

    fetchTemplates(); // Call the async function to fetch templates
  }, [auth?.userId]);

  return (
    <div className="bg-blue-300 p-4 rounded-lg shadow-md space-y-6">
      {/* Header */}
      {/* <h2 className="text-xl font-bold text-white text-center">Your Account</h2> */}

      {/* Avatar and Username */}
      {auth?.username && (
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md">
            <img
              src={`/avatars/${auth.avatar || "default.png"}`}
              alt={`${auth.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Username */}
          <div className="text-lg text-white">
            <span className="font-semibold">{auth.username}</span>
          </div>
        </div>
      )}

      {/* Templates Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Templates</h3>

        {loading ? (
          <div className="text-white">Loading templates...</div> // Loading state
        ) : (
          <ul className="list-disc list-inside text-white">
            {templates.length > 0 ? (
              templates.map((template) => (
                <li key={template.id} className="hover:underline cursor-pointer">
                  <Link href={`/template/${template.id}`} className="text-blue-500">
                    {template.title} @{template.id}
                  </Link>
                </li>
              ))
            ) : (
              <li>No templates available.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
