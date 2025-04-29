import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import IgnoreHydrationErrors from "@/components/IgnoreHydrationErrors";
import { ThemeProvider } from "@/lib/ThemeProvider";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fraxi Anime",
  description: "Anime streaming website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <IgnoreHydrationErrors>
            <Header />
            <div className="pt-16">
              {children}
            </div>
          </IgnoreHydrationErrors>
        </ThemeProvider>
      </body>
    </html>
  );
}
