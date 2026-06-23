import ScrollHero from "./components/ScrollHero";
import FeaturesSection from "./components/FeaturesSection";
import GallerySection from "./components/GallerySection";
import SpecsSection from "./components/SpecsSection";
import HeritageSection from "./components/HeritageSection";
import ClosingCTA from "./components/ClosingCTA";

export default function Home() {
  return (
    <main style={{ background: "#000" }}>
      <ScrollHero />
      <FeaturesSection />
      <GallerySection />
      <SpecsSection />
      <HeritageSection />
      <ClosingCTA />
    </main>
  );
}
