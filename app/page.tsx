import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { PricingSection } from "@/components/pricing-section";
import { TechSection } from "@/components/tech-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemSection />
      <PortfolioSection />
      <PricingSection />
      <TechSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
