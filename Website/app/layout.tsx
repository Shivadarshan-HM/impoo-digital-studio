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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impodigitalstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography in Mysore & HD Kote",
    template: "%s | IMPOO Digital Studio",
  },
  description:
    "Award-winning wedding photography and cinematography studio in Heggadadevanakote (HD Kote), Mysore, Karnataka. Specializing in sacred wedding vows, pre-wedding stories, Haldi rituals, receptions, baby shoots, and luxury wedding albums.",
  keywords: [
    "wedding photography Mysore",
    "wedding photographer Heggadadevanakote",
    "HD Kote wedding studio",
    "Karnataka wedding cinematography",
    "pre-wedding shoot Mysore",
    "Haldi ceremony photography",
    "reception photography Mysore",
    "baby shoot Heggadadevanakote",
    "IMPOO Digital Studio",
    "IMPO Digital Studio",
    "Ravikumar IMPOO",
  ],
  authors: [{ name: "Ravikumar IMPOO", url: siteUrl }],
  creator: "IMPOO Digital Studio",
  publisher: "IMPOO Digital Studio",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography",
    description:
      "Award-winning wedding photography and cinematography studio based in Heggadadevanakote (HD Kote) & Mysore, Karnataka. Preserving sacred vows and emotions with timeless editorial grace.",
    url: siteUrl,
    siteName: "IMPOO Digital Studio",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/portfolio/wedding/cover.jpg",
        width: 1200,
        height: 630,
        alt: "IMPOO Digital Studio — Luxury Wedding Photography in Mysore & HD Kote",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography",
    description:
      "Award-winning wedding photography and cinematography studio based in Heggadadevanakote (HD Kote) & Mysore, Karnataka.",
    images: ["/portfolio/wedding/cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
