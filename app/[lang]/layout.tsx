import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ThemeProvider from "./themeProvider";
import NavBar from "@/components/custom/NavBar";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "@/components/providers/DictionaryProvider";
import QueryProvider from "@/components/providers/QueryProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const dictionary = await getDictionary()

  return (
    <html lang="en" className="overflow-y-scroll">
     
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DictionaryProvider dictionary={dictionary}>
            <body className={inter.className}>
              <div className="w-screen h-screen">
                <NavBar />
                <QueryProvider>
                  {children}
                </QueryProvider>
              </div>
            </body>
          </DictionaryProvider>
        </ThemeProvider>
 
    </html>
  );
}
