import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import FrameAnimationBackground from "./components/FrameAnimationBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impodigitalstudio.com";

export async function generateMetadata(): Promise<Metadata> {
  const title = "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography in Mysore & HD Kote";
  const description =
    "Award-winning wedding photography and cinematography studio in Heggadadevanakote (HD Kote), Mysore, Karnataka. Specializing in sacred wedding vows, pre-wedding stories, Haldi rituals, receptions, baby shoots, and luxury wedding albums.";

  return {
    title,
    description,
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
      "Ravikumar Aradhya",
      "luxury wedding album HD Kote",
      "candid wedding photography Karnataka",
    ],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "IMPOO Digital Studio",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${siteUrl}/portfolio/wedding/cover.jpg`,
          width: 1200,
          height: 630,
          alt: "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography in Mysore & HD Kote",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/portfolio/wedding/cover.jpg`],
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
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["PhotographyBusiness", "LocalBusiness"],
  "@id": `${siteUrl}/#business`,
  name: "IMPOO Digital Studio",
  alternateName: ["IMPO Digital Studio", "IMPOO Photography", "Impoo Studio HD Kote"],
  description:
    "Award-winning wedding photography and cinematography studio in Heggadadevanakote (HD Kote), Mysore, Karnataka. Specializing in sacred wedding vows, pre-wedding stories, Haldi rituals, receptions, baby shoots, and luxury wedding albums.",
  url: siteUrl,
  telephone: "+919739747628",
  priceRange: "₹₹₹",
  image: [
    `${siteUrl}/portfolio/wedding/cover.jpg`,
    `${siteUrl}/portfolio/reception/cover.jpg`,
    `${siteUrl}/portfolio/haldi/cover.jpg`,
  ],
  logo: `${siteUrl}/portfolio/wedding/cover.jpg`,
  founder: {
    "@type": "Person",
    name: "Ravikumar Aradhya",
    jobTitle: "Founder & Lead Cinematographer",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "N.G Complex, Belaganahalli Road, Opposite Police Station",
    addressLocality: "Heggadadevanakote",
    addressRegion: "Karnataka",
    postalCode: "571114",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 11.9617,
    longitude: 76.3278,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "21:00",
  },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Heggadadevanakote",
    },
    {
      "@type": "AdministrativeArea",
      name: "Mysore",
    },
    {
      "@type": "AdministrativeArea",
      name: "Karnataka",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Photography & Cinematography Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding Photography",
          description:
            "Timeless storytelling through elegant, emotion-driven imagery crafted around real moments in Mysore and HD Kote.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding Cinematography",
          description:
            "Cinematic wedding film capture with depth, sound, and atmosphere.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pre Wedding Stories",
          description:
            "Intimate pre-wedding photography shoots balancing elegance and authentic connection.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Haldi Ceremony Photography",
          description:
            "Traditional Haldi ritual photography capturing joyful turmeric celebrations.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Baby Shoot Photography",
          description:
            "Newborn and baby photography preserving early family moments.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Luxury Wedding Albums",
          description:
            "Archival quality curated wedding albums designed with timeless editorial finish.",
        },
      },
    ],
  },
  sameAs: [
    "https://www.instagram.com/impoophotography",
    "https://wa.me/919739747628",
    "https://maps.app.goo.gl/Hf8Cck1eZVhW9ca77",
  ],
};

export default function Home() {
  return (
    <>
      {/* Schema.org LocalBusiness / PhotographyBusiness JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Preloader />
      {/* Sequential Image Frame Animation Hero Background at zIndex 0 (24 FPS) */}
      <FrameAnimationBackground fps={24} />

      {/* Homepage Content Wrapper at zIndex 10 */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <SmoothScroll />
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <PortfolioSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

