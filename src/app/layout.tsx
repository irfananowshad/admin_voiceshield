import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceShield Admin Portal — AI Voice Scam Protection",
  description: "Enterprise Admin & Research Analytics Portal for VoiceShield AI Voice Scam Protection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
