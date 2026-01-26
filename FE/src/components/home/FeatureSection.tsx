import { Store, BookOpen, Users, Trophy, Wallet, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Digital Store',
    description: 'Browse and purchase thousands of games instantly. No physical copies, no waiting.',
  },
  {
    icon: BookOpen,
    title: 'Game Library Management',
    description: 'Organize your collection, create custom categories, and access your games anywhere.',
  },
  {
    icon: Users,
    title: 'Friends & Community',
    description: 'Connect with friends, join gaming communities, and share your achievements.',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Unlock achievements, track your progress, and compete on leaderboards.',
  },
  {
    icon: Wallet,
    title: 'Wallet & Secure Payment',
    description: 'Safe and secure payment processing with multiple payment options available.',
  },
  {
    icon: Smartphone,
    title: 'Cross-device Sync',
    description: 'Play on PC, console, or mobile. Your progress syncs automatically across all devices.',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Powerful <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Everything you need for the ultimate gaming experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-600/20 mb-4 sm:mb-6 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

