'use client'

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <body className={inter.className}>{children}</body>
        </NextUIProvider>
      </QueryClientProvider>
    </html>
  );
}
