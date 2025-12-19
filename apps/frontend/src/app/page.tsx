/**
 * Homepage
 * Main landing page composed of modular sections
 */

import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import DiscoveryFlowsSection from '@/components/home/DiscoveryFlowsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedToolsSection from '@/components/home/FeaturedToolsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <DiscoveryFlowsSection />
      <CategoriesSection />
      <FeaturedToolsSection />
    </main>
  );
}
