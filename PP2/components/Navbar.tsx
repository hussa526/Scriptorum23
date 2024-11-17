import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();  // Import useRouter from Next.js

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigateToHome = () => {
        router.push('/'); // This is how you navigate to the home page in Next.js
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
                <div className="">Scriptorium</div>

                {/* Desktop Navigation Links */}
                <div id="nav-links" className="hidden md:flex space-x-6">
                    <a href="#home" onClick={navigateToHome} className="hover:text-gray-400">Home</a>
                    <a href="#about" className="hover:text-gray-400">About</a>
                    <a href="#services" className="hover:text-gray-400">Services</a>
                    <a href="#contact" className="hover:text-gray-400">Contact</a>
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
                    <a href="#home" className="block py-2 hover:text-gray-400" onClick={navigateToHome}>Home</a>
                    <a href="#about" className="block py-2 hover:text-gray-400">About</a>
                    <a href="#services" className="block py-2 hover:text-gray-400">Services</a>
                    <a href="#contact" className="block py-2 hover:text-gray-400">Contact</a>
                </div>
            </nav>
        </header>
    );
}
