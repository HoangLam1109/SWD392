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
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need for the ultimate gaming experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-600/20 mb-6 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

