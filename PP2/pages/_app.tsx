import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      
      <header id="header" className="w-full bg-gray-800 text-white fixed top-0 left-0 z-50 shadow-md transition-all duration-300">
            <nav id="navbar" className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white z-50 shadow-md transition-all duration-300">
            <Link href="/" className="hover:text-gray-400">Scriptorium</Link>

                {/* Desktop Navigation Links */}
                <div id="nav-links" className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-gray-400">Home</Link>
                    <Link href="/blogpost/create" className="hover:text-gray-400">New Blogpost</Link>
                    <Link href="/template/create" className="hover:text-gray-400">New Template</Link>
                    <Link href="/login" className="hover:text-gray-400">Login</Link>
                </div>

            </nav>
        </header>
        <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
