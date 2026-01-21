import { Sparkles, ArrowRight, Users } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';

export function HeroSection() {
  return (
    <main className="relative">
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">The Future of Gaming</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl leading-[1.1] tracking-tight">
                Your Ultimate
                <br />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Gaming Platform
                </span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                Buy, manage, and play thousands of games in one unified ecosystem. Experience seamless gaming with powerful social features and exclusive deals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-4 flex-wrap">
              <button className="group relative px-8 py-4 rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 transition-all" />
                <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] transition-all" />
                <span className="relative flex items-center gap-2 text-white">
                  Explore Store
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group px-8 py-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
                <span className="flex items-center gap-2">
                  Join Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 md:gap-12 pt-8 flex-wrap">
              <div className="space-y-1">
                <div className="text-3xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  50M+
                </div>
                <div className="text-sm text-slate-500">Active Players</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="space-y-1">
                <div className="text-3xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-slate-500">Games Available</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="space-y-1">
                <div className="text-3xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-slate-500">Support</div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative">
              {/* Glow effects */}
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-600/10 rounded-2xl blur-2xl animate-pulse" />

              {/* Glassmorphism panel */}
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-600/10" />

                {/* Image */}
                <div className="relative rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1620705914357-a9d11009e068?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5lb24lMjBnYW1pbmclMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2ODk2MDUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Gaming platform visualization"
                    className="w-full h-[400px] md:h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent" />
                </div>

                {/* Floating elements */}
                <div className="absolute top-12 right-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">Online</span>
                  </div>
                </div>
                <div className="absolute bottom-12 left-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">5.2M Playing Now</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

