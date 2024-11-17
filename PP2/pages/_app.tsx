import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from "@/context/AuthContext";
import React from 'react';

import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
