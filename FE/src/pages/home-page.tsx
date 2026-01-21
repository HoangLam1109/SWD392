import {
  Navbar,
  HeroSection,
  AboutSection,
  GamesSection,
  FeaturesSection,
  CommunitySection,
  DealsSection,
  Footer,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      <Navbar />
      <HeroSection />
      <AboutSection />
      <GamesSection />
      <FeaturesSection />
      <CommunitySection />
      <DealsSection />
      <Footer />
    </div>
  );
}

