import HeroSection from "@/components/home/HeroSection";
import DiscoveryFlowsSection from "@/components/home/DiscoveryFlowsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedToolsSection from "@/components/home/FeaturedToolsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <HeroSection />
      <DiscoveryFlowsSection />
      <CategoriesSection />
      <FeaturedToolsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
