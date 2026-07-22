export type PortfolioOrientation = "landscape" | "portrait" | "square";

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: PortfolioOrientation;
}

export const portfolioImages: PortfolioImage[] = [
  {
    id: "wedding-sunset-pair",
    src: "/images/portfolio/exhibition-04.jpg",
    alt: "Wedding couple standing together at sunset by the water",
    width: 1280,
    height: 720,
    orientation: "landscape",
    
  },
  {
    id: "wedding-ceremony-arch",
    src: "/images/portfolio/WhatsApp Image 2026-07-17 at 10.26.37 PM.jpeg",
    alt: "Wedding ceremony arch arranged outdoors with floral decor",
    width: 1600,
    height: 1066,
    orientation: "landscape",
  },
  {
    id: "bride-closeup",
    src: "/images/portfolio/WhatsApp Image 2026-07-17 at 10.26.30 PM.jpeg",
    alt: "Bride in an elegant close-up portrait",
    width: 851,
    height: 1280,
    orientation: "portrait",
  },
  {
    id: "wedding-portrait-pair",
    src: "/images/portfolio/exhibition-17.jpg",
    alt: "Couple posing together during a wedding portrait",
    width: 1280,
    height: 720,
    orientation: "landscape",
  },
  {
    id: "bride-side-portrait",
    src: "/images/portfolio/WhatsApp Image 2026-07-17 at 10.26.29 PM.jpeg",
    alt: "Bride shown in a refined side portrait",
    width: 751,
    height: 1072,
    orientation: "portrait",
  },
  {
    id: "prewedding-embrace",
    src: "/images/portfolio/prewedding-01.jpg",
    alt: "Couple embracing during a pre-wedding portrait",
    width: 1280,
    height: 720,
    orientation: "landscape",
  },
  {
    id: "groom-portrait",
    src: "/images/portfolio/exhibition-18.jpg",
    alt: "Groom portrait in a styled indoor setting",
    width: 851,
    height: 1280,
    orientation: "portrait",
  },
  {
    id: "wedding-still",
    src: "/images/portfolio/exhibition-03.jpg",
    alt: "Wedding couple portrait framed in soft evening light",
    width: 1280,
    height: 720,
    orientation: "landscape",
  },
  {
    id: "sunset-walk",
    src: "/images/portfolio/exhibition-04.jpg",
    alt: "Wedding couple walking together near the water at sunset",
    width: 1280,
    height: 720,
    orientation: "landscape",
  },
];
