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

export default function Home() {
  return (
    <>
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
