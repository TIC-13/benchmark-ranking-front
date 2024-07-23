'use client'

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NextUIProvider } from "@nextui-org/react";
import ThemeProvider from "./themeProvider";
import NavBar from "@/components/custom/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <html lang="en" className="overflow-y-scroll">
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <body className={inter.className}>
              <div className="w-screen h-screen">
                <NavBar/>
                {children}
              </div>
            </body>
          </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </html>
  );
}
