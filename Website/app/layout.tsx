import type { Metadata } from "next";
import { Inter, Cormorant, Bebas_Neue, Cormorant_Garamond, Manrope, JetBrains_Mono, Alex_Brush } from "next/font/google";
import "./globals.css";
import "./components/GlareHover.css";
import "./components/SpecularButton.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const alexBrush = Alex_Brush({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IMPOO Digital Studio — Premium Photography & Cinematography",
  description:
    "Award-winning photography and cinematography studio specializing in weddings, pre-wedding, engagement, maternity, and corporate events. Based in HD Kote, Mysore.",
  keywords: [
    "photography studio",
    "cinematography",
    "wedding photography",
    "pre-wedding shoot",
    "Mysore photographer",
    "HD Kote",
    "IMPOO Digital Studio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} ${bebasNeue.variable} ${cormorantGaramond.variable} ${alexBrush.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-[#090909] text-[#F5F2EB]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
