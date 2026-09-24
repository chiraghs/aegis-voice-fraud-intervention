import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisVoice AI • Real-Time Voice Fraud Intervention (ElevenLabs × Ignyte)",
  description: "Real-time multilingual voice agent built on ElevenLabs and Twilio for immediate banking fraud intervention and pre-approved card protection under CBUAE standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
