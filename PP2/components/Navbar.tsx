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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 0l3-3m-3 3l-3-3m3 9c4.418 0 8-3.582 8-8s-3.582-8-8-8c-1.104 0-2.162.229-3.139.639 2.85 2.396 4.139 5.616 4.139 8.361 0 6.627-5.373 12-12 12-3.268 0-6.241-1.246-8.46-3.286 1.082 2.58 3.613 4.409 6.651 5.186A11.88 11.88 0 0 0 12 21c6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 0l3-3m-3 3l-3-3M12 21c-6.627 0-12-5.373-12-12S5.373 3 12 3c1.657 0 3.25.578 4.5 1.5C15.057 5.492 13.656 4 12 4c-4.418 0-8 3.582-8 8 0 1.038.222 2.021.57 2.907C4.186 13.505 3 15.406 3 17c0 2.5 1.5 4.5 4.5 4.5s4.5-2 4.5-4.5c0-2.5-2-4.5-4.5-4.5-.505 0-.993.097-1.427.258 0-.005 0-.01-.003-.015-.042-.077-.078-.157-.121-.238-.269-.49-.56-.941-.881-1.377-.08.188-.177.368-.286.546-.112.171-.24.338-.383.5.98-.247 1.856-.651 2.653-1.196a9.881 9.881 0 0 1 1.428 3.191C15.637 15.264 13.698 17 12 17c-4.418 0-8-3.582-8-8z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}
