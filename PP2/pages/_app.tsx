import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/DarkModeContext';
import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
