import localFont from "next/font/local";

import Footer from '@/components/Footer';
import MainSearch from '@/components/MainSearch';
import HomeAside from '@/components/user/HomeAside';

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
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {/* Main Content Section */}
        <div className="grid pt-16 px-8 gap-6 md:grid-cols-12 grid-cols-1">
          {/* Header */}
          {/* <div className="bg-blue-600 text-white text-center py-6 rounded-lg shadow-lg col-span-12">
            <h1 className="text-3xl font-semibold">Welcome to Our Platform</h1>
            <p className="mt-2 text-lg">The best place to search, discover, and create.</p>
          </div> */}

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
    </>
  );
}
