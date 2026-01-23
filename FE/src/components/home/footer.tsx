import { Gamepad2, ShoppingBag, Library, Users, HelpCircle, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'Store', icon: ShoppingBag, href: '#' },
    { name: 'Library', icon: Library, href: '#' },
    { name: 'Community', icon: Users, href: '#' },
    { name: 'Support', icon: HelpCircle, href: '#' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Refund Policy', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Logo & Description */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50" />
                <div className="relative bg-linear-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <span className="text-lg sm:text-xl tracking-tight font-bold">NEXUS</span>
            </div>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Your ultimate gaming platform. Buy, manage, and play thousands of games in one unified ecosystem.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-blue-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm sm:text-base text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-3 sm:mb-4">
              Subscribe to get notified about new games and exclusive deals.
            </p>
            <form className="space-y-2 sm:space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all font-medium text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} NexusPlay. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <span>Made with ❤️ for gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

