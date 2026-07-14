import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-field-display",
  weight: ["500", "600", "700"],
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-field-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ASYON Presentations",
  description: "College onboarding and July 14 agenda presentations for Block Street / ASYON.",
};

export default function PresentationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen bg-field-paper font-fieldSans text-field-ink antialiased`}
    >
      {children}
    </div>
  );
}
