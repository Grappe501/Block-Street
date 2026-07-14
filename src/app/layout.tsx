import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ElectionCountdown } from "@/components/ElectionCountdown";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASYON — Arkansas Student & Youth Organizing Network",
  description:
    "Connect Locally. Organize Statewide. Lead Together. A nonpartisan organizing platform for Arkansas youth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <ElectionCountdown />
        {children}
      </body>
    </html>
  );
}
