import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Country Explorer",
  description: "NextJs app using Country API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*Navbar*/}
        <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto">
          <div className="flex items-center space-x-6">
          <Link href={"/"}>Home</Link>
          <Link href={"/src/app/about"}> About</Link>
          <Link href={"/src/app/Contact"}> Contact Us</Link>
          </div> 
        </nav>
        </header>
        <main className="p-5">{children}</main>
        <footer className="bg-gray-200 text-center p-4 mt-18">
          <p></p>
        </footer>
      </body>
    </html>
  );
}
