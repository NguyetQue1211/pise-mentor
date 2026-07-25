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
    "Tìm mentor phù hợp cho bước tiếp theo của bạn. Khám phá các mentor của PISE theo địa điểm, lĩnh vực và ngành nghề.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Warm up the connection to Calendly so the booking popup opens faster */}
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://calendly.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
