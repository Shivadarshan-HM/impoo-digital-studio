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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PhotographyBusiness",
  "@id": `${siteUrl}/#business`,
  "name": "IMPOO Digital Studio",
  "alternateName": ["IMPO Digital Studio", "IMPOO Photography"],
  "description":
    "Award-winning wedding photography and cinematography studio in Heggadadevanakote (HD Kote), Mysore, Karnataka. Specializing in sacred wedding vows, pre-wedding stories, Haldi rituals, receptions, and luxury wedding albums.",
  "url": siteUrl,
  "telephone": "+919739747628",
  "priceRange": "₹₹₹",
  "image": `${siteUrl}/portfolio/wedding/cover.jpg`,
  "logo": `${siteUrl}/portfolio/wedding/cover.jpg`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "N.G Complex, Belaganahalli Road, Opposite Police Station",
    "addressLocality": "Heggadadevanakote",
    "addressRegion": "Karnataka",
    "postalCode": "571114",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.9617,
    "longitude": 76.3278
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "21:00"
  },
  "areaServed": [
    {
      "@type": "AdministrativeArea",
      "name": "Heggadadevanakote"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Mysore"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Karnataka"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Photography & Cinematography Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Wedding Photography",
          "description": "Timeless storytelling through elegant, emotion-driven imagery crafted around real moments in Mysore and HD Kote."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Wedding Cinematography",
          "description": "Cinematic wedding film capture with depth, sound, and atmosphere."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Pre Wedding Stories",
          "description": "Intimate pre-wedding photography shoots balancing elegance and authentic connection."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Haldi Ceremony Photography",
          "description": "Traditional Haldi ritual photography capturing joyful turmeric celebrations."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Baby Shoot Photography",
          "description": "Newborn and baby photography preserving early family moments."
        }
      }
    ]
  },
  "sameAs": [
    "https://www.instagram.com/impoophotography",
    "https://wa.me/919739747628",
    "https://maps.app.goo.gl/vU3DDpii8tfGSK1YA"
  ]
};

export default function Home() {
  return (
    <>
      {/* Schema.org LocalBusiness JSON-LD Structured Data */}
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
