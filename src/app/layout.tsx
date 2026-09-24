import type { Metadata } from "next";
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
      <body className="antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
