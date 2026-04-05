import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrumbIQ - Zero Waste Kitchen",
  description: "AI-powered kitchen management",
};

import { LocalizationProvider } from "@/lib/LocalizationContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/50 dark:selection:text-emerald-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocalizationProvider>
            <ClientLayout>{children}</ClientLayout>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
