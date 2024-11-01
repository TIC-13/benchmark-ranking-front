import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import ThemeProvider from "./themeProvider";
import NavBar from "@/components/custom/NavBar";
import DictionaryProvider from "@/components/providers/DictionaryProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
     
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DictionaryProvider>
            <body className={inter.className}>
                <Toaster/>
                <NavBar />
                <QueryProvider>
                  {children}
                </QueryProvider>
            </body>
          </DictionaryProvider>
        </ThemeProvider>
 
    </html>
  );
}
