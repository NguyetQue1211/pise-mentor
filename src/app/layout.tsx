import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "PISE Mentorship Portal",
  description:
    "Find the right mentor for your next step. Browse PISE mentors by location, discipline, and industry.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
