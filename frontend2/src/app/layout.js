import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Sansita, Open_Sans } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";
import Canonical from "@/components/Canonical";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sansita = Sansita({
  variable: "--font-sansita",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "PopHits.org - 70 years of hit songs",
  description: "Explore top-rated songs, random hits by decade, and number one hits on PopHits.org. Discover iconic singles from the 50s to today.",
  keywords: "pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <Canonical />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${sansita.variable} ${openSans.variable} antialiased bg-gray-50`}>
        <AuthProviderWrapper>
          {/* Google Analytics wrapped in Suspense boundary */}
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          
          <Navbar />
          <div className="app-container">
            {children}
          </div>
          <Footer />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
