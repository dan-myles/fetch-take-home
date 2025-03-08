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
  title: "Fetch Some Dogs 🐶",
  description: "A simple site to fetch some dogs!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100 min-h-screen flex flex-col`}
      >
        <Link href="/">
          <header className="bg-transparent py-6 sticky top-0 z-10 backdrop-blur-lg mb-12">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl" role="img" aria-label="Dog emoji">
                  🐶
                </span>
                <span className="font-bold text-2xl text-gray-800">
                  PawLookup
                </span>
              </div>
            </div>
          </header>
        </Link>
        {children}
      </body>
    </html>
  );
}
