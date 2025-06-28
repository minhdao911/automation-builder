import { LampComponent } from "@/components/lamp";
import LandingNavBar from "@/components/landing-navbar";
import FeatureList from "@/components/feature-list";
import IntegrationList from "@/components/integration-list";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="bg-neutral-950">
      <LandingNavBar />

      {/* Hero Section */}
      <Hero />

      {/* Key Features Section */}
      <FeatureList />

      {/* Integrations */}
      <IntegrationList />

      {/* Final CTA */}
      <LampComponent />
    </main>
  );
}
