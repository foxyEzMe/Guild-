import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, MessageCircle, Calendar, Camera, 
  Zap, Moon, Sun, Palette, Volume2, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useThemeCustomization();

  // Sons d'interaction gaming
  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  // Vibration mobile
  const vibrate = () => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate([30, 20, 30]);
    }
  };

  const toggleMobileMenu = () => {
    playClickSound();
    vibrate();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Effet de défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = isAuthenticated ? [
    { href: '/', label: 'Accueil', icon: <Home className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
    { href: '/events', label: 'Événements', icon: <Calendar className="w-5 h-5" />, gradient: 'from-violet-500 to-purple-600' },
    { href: '/members', label: 'Membres', icon: <Users className="w-5 h-5" />, gradient: 'from-purple-600 to-violet-500' },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-5 h-5" />, gradient: 'from-violet-600 to-purple-500' },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
  ];

  return (
    <>
      {/* Navigation principale */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
        ? 'bg-black/95 backdrop-blur-xl shadow-2xl border-b border-purple-500/20' 
        : 'bg-black/80 backdrop-blur-md'
      }`}>
        {/* Bordure néon animée */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-all duration-300"
                  style={{
                    background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                ></div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                >
                  <Crown className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span 
                  className="text-lg font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`
                  }}
                >
                  S.L.Z Guild
                </span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative"
                >
                  <div 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      location === link.href
                        ? 'text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-opacity-10'
                    }`}
                    style={{
                      backgroundColor: location === link.href 
                        ? theme.primaryColor
                        : 'transparent',
                      boxShadow: location === link.href 
                        ? `0 4px 20px ${theme.primaryColor}40`
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (location !== link.href) {
                        e.currentTarget.style.backgroundColor = `${theme.primaryColor}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location !== link.href) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </span>
                    <span className="font-medium">
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Menu utilisateur Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated && user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button 
                        className="text-white font-medium px-3 py-2 text-sm transition-all duration-200"
                        style={{
                          background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          boxShadow: `0 2px 10px ${theme.primaryColor}30`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primaryColor}50`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = `0 2px 10px ${theme.primaryColor}30`;
                        }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-500/10">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                          <img
                            src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white font-medium hidden xl:block">{user.username}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-black/95 backdrop-blur-xl border border-purple-500/30" align="end">
                      <div className="flex items-center space-x-3 p-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/30">
                          <img
                            src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.username}</p>
                          <p className="text-sm text-purple-400">{user.isAdmin ? 'Admin' : 'Membre'}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center space-x-3 p-3 hover:bg-purple-500/10">
                          <User className="w-4 h-4" />
                          <span>Profil</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center space-x-3 p-3 hover:bg-purple-500/10">
                            <Settings className="w-4 h-4" />
                            <span>Administration</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem 
                        onClick={() => logout.mutate()}
                        className="flex items-center space-x-3 p-3 hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white">
                    Connexion
                  </Button>
                </Link>
              )}
            </div>

            {/* Bouton hamburger mobile */}
            <div className="lg:hidden mobile-menu-container">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all duration-200"
                onClick={toggleMobileMenu}
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}></span>
                  <span className={`block w-5 h-0.5 bg-white rounded-full mt-1 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`block w-5 h-0.5 bg-white rounded-full mt-1 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}></span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile en overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Fond sombre avec blur */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Menu latéral */}
        <div className={`mobile-menu-container absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-black/95 backdrop-blur-xl border-l border-purple-500/30 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header du menu */}
          <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                <Crown className="text-white w-4 h-4" />
              </div>
              <span className="text-white font-bold">S.L.Z Guild</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg hover:bg-purple-500/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Profil utilisateur mobile */}
          {isAuthenticated && user && (
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                  <img
                    src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{user.username}</p>
                  <p className="text-sm text-purple-400">{user.isAdmin ? 'Administrateur' : 'Membre'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation mobile */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                    location === link.href
                      ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}>
                    <span className="flex-shrink-0">
                      {link.icon}
                    </span>
                    <span className="font-medium">
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}

              {/* Actions utilisateur mobile */}
              {isAuthenticated && user && (
                <>
                  <div className="h-px bg-purple-500/20 my-4"></div>
                  
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-4 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200">
                      <User className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">Mon Profil</span>
                    </div>
                  </Link>

                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center space-x-4 p-3 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all duration-200">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Administration</span>
                      </div>
                    </Link>
                  )}

                  <div className="h-px bg-purple-500/20 my-4"></div>

                  <button
                    onClick={() => {
                      logout.mutate();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-4 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer pour éviter que le contenu soit caché sous la navbar */}
      <div className="h-16"></div>
    </>
  );
}