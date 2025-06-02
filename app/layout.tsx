import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { AuthProvider } from "context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MH2025",
  description: "MH2025 - SupportSpace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col gradient-background`}>
         <AuthProvider>
        <Navbar />
        <main className="flex-grow p-6">{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
