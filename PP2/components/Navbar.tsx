import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/DarkModeContext'; // Import ThemeContext
import Link from "next/link";

export default function Navbar() {
    const router = useRouter();  // Import useRouter from Next.js
    const auth = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Access dark mode state and toggle function

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigateToHome = () => {
        router.push('/'); // This is how you navigate to the home page in Next.js
    };

    const handleLogout = () => {
        if (auth?.logout) {
            auth.logout(); // Call the logout function from the context
            alert("Logout successful");
            navigateToHome();
        } else {
            alert("Logout unsuccessful");
        }
    };

    useEffect(() => {
        let prevScrollY = window.scrollY;

        const handleScroll = () => {
            const navbar = document.getElementById('navbar');

            if (navbar) {
                if (window.scrollY > prevScrollY) {
                    navbar.classList.add('translate-y-[-100%]');
                } else {
                    navbar.classList.remove('translate-y-[-100%]');
                }
                prevScrollY = window.scrollY;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header id="header" className="w-full bg-gray-800 text-white fixed top-0 left-0 z-50 shadow-md transition-all duration-300">
            <nav id="navbar" className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white z-50 shadow-md transition-all duration-300">
                <Link href="/" className="hover:text-gray-400">Scriptorium</Link>

                {/* Desktop Navigation Links */}
                <div id="nav-links" className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-gray-400">Home</Link>

                    {auth?.role === 'admin' ? (
                        auth?.isAuthenticated && (
                            <button onClick={handleLogout} className="text-white hover:text-gray-400">
                                Logout
                            </button>
                        )
                    ) : (
                        <>
                            <Link href="/blogpost/create" className="hover:text-gray-400">New Blogpost</Link>
                            <Link href="/template/create" className="hover:text-gray-400">New Template</Link>
                            <Link href="/execution" className="hover:text-gray-400">Code Execution</Link>
                            {auth?.isAuthenticated ? (
                                <button onClick={handleLogout} className="text-white hover:text-gray-400">
                                    Logout
                                </button>
                            ) : (
                                <Link href="/user/login" className="hover:text-gray-400">Login</Link>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div id="hamburger-menu" className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                <div id="nav-links-sm" className={`${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} absolute top-full left-0 w-full bg-gray-700 text-white md:hidden p-6 transition-all duration-300 ease-in-out`}>
                    <Link href="/" className="block py-2 hover:text-gray-400">Home</Link>

                    {auth?.role === 'admin' ? (
                        auth?.isAuthenticated && (
                            <button onClick={handleLogout} className="text-white hover:text-gray-400">
                                Logout
                            </button>
                        )
                    ) : (
                        <>
                            <Link href="/blogpost/create" className="block py-2 hover:text-gray-400">New Blogpost</Link>
                            <Link href="/template/create" className="block py-2 hover:text-gray-400">New Template</Link>
                            <Link href="/execution" className="block py-2 hover:text-gray-400">Code Execution</Link>
                            {auth?.isAuthenticated ? (
                                <button onClick={handleLogout} className="text-white hover:text-gray-400">
                                    Logout
                                </button>
                            ) : (
                                <Link href="/user/login" className="hover:text-gray-400">Login</Link>
                            )}
                        </>
                    )}
                </div>

                {/* Dark Mode Toggle Button */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleTheme} 
                        className="text-white hover:text-gray-400 focus:outline-none"
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364l-2.121-2.121M6.343 6.343l-2.121-2.121m12.121 12.121l2.121 2.121M6.343 17.657l-2.121 2.121M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}
