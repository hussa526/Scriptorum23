import { useRouter } from 'next/router';
import localFont from "next/font/local";
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

import Footer from '@/components/Footer';
import MainSearch from '@/components/MainSearch';
import HomeAside from '@/components/user/HomeAside';
import AdminHome from '@/components/user/AdminHome';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
	const auth = useContext(AuthContext);
	const router = useRouter();  // Initialize router

	return (
		<>
		  {auth ? (
			auth.role === 'admin' ? (
			  <AdminHome /> // Do nothing here as user is being redirected to /reports
			) : (
			  <div className="bg-gray-50 min-h-screen flex flex-col">
				{/* Main Content Section */}
				<div className="grid pt-16 px-8 gap-6 md:grid-cols-12 grid-cols-1">
				  {/* Left Sidebar */}
				  <div className="col-span-12 md:col-span-3">
					<HomeAside />
				  </div>
	  
				  {/* Sidebar and Main Content */}
				  <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
					{/* Main Search */}
					<div className="bg-white rounded-lg p-6 shadow-lg">
					  <MainSearch />
					</div>
	  
					{/* Footer */}
					<div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
					  <Footer />
					</div>
				  </div>
				</div>
			  </div>
			)
		  ) : (
			<p>Loading...</p> // Fallback if auth is null or undefined
		  )}
		</>
	  );
}
