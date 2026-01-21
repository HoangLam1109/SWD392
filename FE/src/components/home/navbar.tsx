import { Gamepad2, ShoppingBag, Library, Users, Tag, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="relative z-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-2xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50" />
                <div className="relative bg-linear-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl tracking-tight">NEXUS</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <ShoppingBag className="w-4 h-4" />
                Store
              </a>
              <a href="#" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Library className="w-4 h-4" />
                Library
              </a>
              <a href="#" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Users className="w-4 h-4" />
                Community
              </a>
              <a href="#" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Tag className="w-4 h-4" />
                Deals
              </a>
              <div className="w-px h-6 bg-white/10" />
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

