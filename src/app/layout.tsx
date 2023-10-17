"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import "@/theme/theme.css";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "@/components/Navbar";
import "primeicons/primeicons.css";
import Footer from "@/components/Footer";
import { AuthContextProvider } from "./context/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrimeReactProvider>
      <html lang="en">
        <title>Cooplearn</title>
        <link
          rel="icon"
          href="./favicon/favicon.ico"
          type="image/x-icon"
          sizes="400x400"
        />
        <AuthContextProvider>
          <body className={inter.className}>
            <Navbar></Navbar>
            {children}
            <Footer></Footer>
          </body>
        </AuthContextProvider>
      </html>
    </PrimeReactProvider>
  );
}
