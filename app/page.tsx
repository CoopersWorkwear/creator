import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import BrandsMarquee from "./components/BrandsMarquee";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import WhyUsSection from "./components/WhyUsSection";
import ContactSection from "./components/ContactSection";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandsMarquee />
        <ServicesSection />
        <AboutSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
