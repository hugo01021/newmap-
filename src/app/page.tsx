import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/layout/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LiveDemo } from "@/components/home/LiveDemo";
import { Included } from "@/components/home/Included";
import { Protection } from "@/components/home/Protection";
import { AiManager } from "@/components/home/AiManager";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";

export default function HomePage() {
  return (
    <>
      <Navbar overlay />
      <main>
        <Hero />
        <Intro />
        <HowItWorks />
        <LiveDemo />
        <Included />
        <Protection />
        <AiManager />
        <Pricing />
        <Faq />
      </main>
      <FinalCta />
      <Footer />
    </>
  );
}
