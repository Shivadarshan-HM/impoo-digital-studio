import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMPOO Admin System — Studio Management",
  description:
    "Luxury Studio Admin Portal for IMPOO Digital Studio. Managing portfolio categories, photos, and client leads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-gold-400/20 selection:text-gold-400"
      >
        {children}
      </body>
    </html>
  );
}
