import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Library, Users, Tag, User, Menu, X, ShoppingBasket, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitchButton } from '@/components/common/LanguageSwitchButton';

interface NavbarProps {
  /** Navbar cố định ở top khi scroll (dùng cho LibraryPage) */
  fixed?: boolean;
}

export function Navbar({ fixed }: NavbarProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={`z-50 w-full ${fixed ? 'fixed top-0 left-0 right-0' : 'relative'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-2xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50" />
                <div className="relative">
                  <img src="/src/assets/platfun-logo.svg" alt="logo" className="h-12" />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/store" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span>{t('common.store')}</span>
              </Link>
              <Link to="/library" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Library className="w-4 h-4" />
                <span>{t('common.library')}</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Users className="w-4 h-4" />
                <span>{t('common.community')}</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Tag className="w-4 h-4" />
                <span>{t('common.deals')}</span>
              </Link>
              <Link to="/cart" className="relative flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <ShoppingBasket className="w-4 h-4" />
                <span>{t('common.cart')}</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
              </Link>
              <div className="w-px h-6 bg-white/10" />
              <LanguageSwitchButton className="text-white bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white" />
              {isAuthenticated ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                        <AvatarFallback className="bg-blue-500/20 text-white text-sm">
                          {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 z-[100] backdrop-blur-xl bg-slate-900/95 border border-white/10 text-white shadow-xl shadow-black/20 rounded-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="text-white focus:bg-white/10 focus:text-white cursor-pointer [&_svg]:text-white/90"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('common.profile')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-white bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                  {t('common.login')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label={t('common.toggleMenu')}
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
                to="/store"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Store
              </Link>
              <Link
                to="/library"
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
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBasket className="w-4 h-4" />
                Cart
                <span className="ml-auto px-2 py-0.5 bg-blue-500 rounded-full text-xs font-bold">
                  3
                </span>
              </Link>
              <div className="w-full h-px bg-white/10 my-2" />
              <div className="px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                <LanguageSwitchButton className="w-full justify-center text-white bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white" />
              </div>
              {isAuthenticated ? (
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-blue-500/20 text-white text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 flex-1 rounded-lg hover:bg-white/5 transition-colors text-sm py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {t('common.profile')}
                  </Link>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 text-white bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                  {t('common.login')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

