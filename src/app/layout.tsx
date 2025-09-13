// src/app/layout.tsx
import "./globals.css";
import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Civic Violation",
  description: "Report civic issues",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <AuthProvider>
          <div className="max-w-6xl mx-auto p-6">
            <Navbar />
            <main>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
