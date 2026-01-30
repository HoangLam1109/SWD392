import { useState } from 'react';
import { Gamepad2, ShoppingBag, Library, Users, Tag, User, Menu, X ,ShoppingBasket} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  /** Navbar cố định ở top khi scroll (dùng cho LibraryPage) */
  fixed?: boolean;
}

export function Navbar({ fixed }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`z-50 w-full ${fixed ? 'fixed top-0 left-0 right-0' : 'relative'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-2xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50" />
                <div className="relative bg-linear-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <span className="text-lg sm:text-xl tracking-tight">NEXUS</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span>Store</span>
              </Link>
              <Link to="/library" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Library className="w-4 h-4" />
                <span>Library</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Tag className="w-4 h-4" />
                <span>Deals</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <ShoppingBasket className="w-4 h-4" />
                <span>Cart</span>
              </Link>
              <div className="w-px h-6 bg-white/10" />
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/10 space-y-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Store
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <Library className="w-4 h-4" />
                Library
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                Community
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <Tag className="w-4 h-4" />
                Deals
              </Link>
              <div className="w-full h-px bg-white/10 my-2" />
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

