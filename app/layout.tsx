import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { frFR } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task manager",
  description: "Task manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={frFR}>
      <html
        lang="fr"
        className={cn(inter.className, "dark")}
        style={{
          colorScheme: "dark",
        }}
      >
        <body>
          <ThemeProvider>
            <div
              className="
             flex
             min-h-screen
             w-full
             flex-col
             items-center
             dark:bg-black"
            >
              <Navbar />
              <Separator />
              <main className="flex flex-grow w-full justify-center items-center dark:bg-neutral-950">
                {children}
                <Toaster />
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
