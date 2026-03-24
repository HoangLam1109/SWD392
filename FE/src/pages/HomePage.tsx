import { motion } from 'framer-motion';
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

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      <Navbar />
      <div>
        <HeroSection />
      </div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={0}
      >
        <AboutSection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={1}
      >
        <GamesSection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={2}
      >
        <FeaturesSection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={3}
      >
        <CommunitySection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={4}
      >
        <DealsSection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={5}
      >
        <Footer />
      </motion.div>
    </div>
  );
}

