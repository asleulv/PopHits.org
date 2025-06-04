import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Sansita } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

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

export const metadata = {
  title: "PopHits.org - 70 years of hit songs",
  description: "Explore top-rated songs, random hits by decade, and number one hits on PopHits.org. Discover iconic singles from the 50s to today.",
  keywords: "pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sansita.variable} antialiased bg-gray-50`}>
        <AuthProviderWrapper>
          {/* Google Analytics */}
          <GoogleAnalytics />
          
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
