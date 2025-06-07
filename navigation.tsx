import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, User, LogOut, Shield, MessageCircle, Calendar, Camera, Zap, Moon, Sun, Palette, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Sons d'interaction gaming
  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Vibration mobile
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const toggleMobileMenu = () => {
    playClickSound();
    vibrate();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Effet de défilement pour changer la navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navLinks = isAuthenticated ? [
    { href: '/', label: 'Accueil', icon: <Home className="w-4 h-4" />, gradient: 'from-purple-500 to-violet-600' },
    { href: '/events', label: 'Événements', icon: <Calendar className="w-4 h-4" />, gradient: 'from-violet-500 to-purple-600' },
    { href: '/members', label: 'Membres', icon: <Users className="w-4 h-4" />, gradient: 'from-purple-600 to-violet-500' },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-4 h-4" />, gradient: 'from-violet-600 to-purple-500' },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-4 h-4" />, gradient: 'from-purple-500 to-violet-600' },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-4 h-4" />, gradient: 'from-purple-500 to-violet-600' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
      ? 'bg-deep-black/95 backdrop-blur-xl shadow-2xl border-b border-neon-purple/30' 
      : 'bg-transparent backdrop-blur-sm'
    }`}>
      {/* Bordure néon animée */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-60"></div>
      
      {/* Effet subtil de gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-electric-blue/5 opacity-80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo et Marque */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative animate-subtle-float">
              {/* Aura néon autour du logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-electric-blue rounded-full opacity-30 blur-xl group-hover:opacity-50 transition-all duration-500 animate-pulse-slow"></div>
              
              {/* Logo principal */}
              <div className="w-14 h-14 bg-gradient-to-br from-neon-purple via-neon-violet to-electric-blue rounded-full flex items-center justify-center relative shadow-2xl">
                <Crown className="text-white w-7 h-7 animate-subtle-float" />
                {/* Particules scintillantes */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-electric-blue rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan bg-clip-text text-transparent animate-text-glow">
                ARISE CROSSOVER
              </span>
              <span className="text-xs text-light-gray/80 tracking-wider uppercase">Elite Gaming Guild</span>
            </div>
          </Link>

          {/* Navigation Desktop - BOUTONS INCROYABLES */}
          <div className="hidden lg:flex items-center space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group"
              >
                <div className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-500 group overflow-hidden transform hover:scale-110 hover:-translate-y-1 ${
                  location === link.href
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-2xl shadow-purple-500/40 scale-105 animate-pulse`
                    : 'text-white/80 hover:text-white hover:shadow-2xl hover:shadow-purple-500/30'
                }`}>
                  {/* Fond glassmorphism */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
                  
                  {/* Bordure animée */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Effet de particules */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                    <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  
                  {/* Effet de balayage lumineux */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-2xl"></div>
                  
                  {/* Icône avec effet */}
                  <span className="relative z-10 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                    {link.icon}
                  </span>
                  
                  {/* Texte */}
                  <span className="font-bold tracking-wide relative z-10 group-hover:text-white transition-colors duration-300">
                    {link.label}
                  </span>
                  
                  {/* Indicateur actif amélioré */}
                  {location === link.href && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r ${link.gradient} rounded-full animate-pulse`}></div>
                  )}
                </div>
              </Link>
            ))}
            

            
            {/* Menu utilisateur pour les utilisateurs connectés */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                {/* Accès direct admin */}
                {isAdmin && (
                  <Link href="/admin">
                    <Button className="bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-magenta hover:to-neon-purple text-white font-bold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-neon-purple/50 animate-neon-flicker">
                      <Shield className="w-4 h-4 mr-2" />
                      ADMIN PANEL
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 group">
                      {/* Bordure néon animée autour de l'avatar */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
                      
                      {/* Conteneur de l'avatar */}
                      <div className="relative bg-dark-surface rounded-full overflow-hidden border-2 border-neon-purple/50 group-hover:border-electric-blue/80 transition-all duration-300">
                        <img
                          src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                          alt={`Avatar de ${user.username}`}
                          className="w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:rotate-3"
                        />
                        
                        {/* Overlay lumineux au survol */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                        
                        {/* Indicateur de statut en ligne */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-surface animate-pulse"></div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-dark-surface/95 backdrop-blur-xl border border-neon-purple/30 shadow-2xl" align="end">
                    <div className="flex items-center justify-start gap-3 p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-neon-purple/30">
                        <img
                          src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                          alt={`Avatar de ${user.username}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-bold text-white text-base">{user.username}</p>
                        <p className="text-sm text-neon-purple">{user.isAdmin ? 'Administrateur' : 'Membre'}</p>
                        <p className="w-[180px] truncate text-xs text-light-gray">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-neon-purple/20" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-3 p-3 text-light-gray hover:text-white hover:bg-neon-purple/20 transition-colors duration-300">
                        <User className="h-4 w-4" />
                        <span>Mon Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-3 p-3 text-neon-purple hover:text-electric-blue hover:bg-neon-purple/20 transition-colors duration-300">
                          <Settings className="h-4 w-4" />
                          <span>Panel Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-neon-purple/20" />
                    <DropdownMenuItem 
                      onClick={() => logout.mutate()}
                      className="flex items-center gap-3 p-3 text-light-gray hover:text-white hover:bg-red-500/20 transition-colors duration-300 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          {/* Bouton Menu Mobile STYLÉ */}
          <div className="lg:hidden relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-12 h-12 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-110 group overflow-hidden"
              onClick={toggleMobileMenu}
            >
              {/* Fond animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Menu hamburger COMPLÈTEMENT STYLÉ */}
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                {/* Première barre avec effet de dégradé */}
                <span className={`block w-6 h-1 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full shadow-lg shadow-purple-500/50 transition-all duration-500 transform ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-gradient-to-r from-violet-400 to-purple-300 scale-110' : 'hover:scale-105'
                }`}></span>
                
                {/* Deuxième barre avec animation de disparition élégante */}
                <span className={`block w-5 h-1 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full shadow-lg shadow-violet-500/50 mt-1 transition-all duration-500 transform origin-center ${
                  isMobileMenuOpen ? 'opacity-0 scale-0 rotate-180' : 'hover:scale-105 hover:w-6'
                }`}></span>
                
                {/* Troisième barre avec effet miroir */}
                <span className={`block w-6 h-1 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full shadow-lg shadow-purple-500/50 mt-1 transition-all duration-500 transform ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-gradient-to-r from-violet-400 to-purple-300 scale-110' : 'hover:scale-105'
                }`}></span>
              </div>
              
              {/* Effet de particules au clic */}
              {isMobileMenuOpen && (
                <>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-violet-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile ULTRA AMÉLIORÉ avec effets violet/noir */}
      <div 
        className={`lg:hidden relative overflow-hidden transition-all duration-700 ease-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Fond avec effets de particules violettes */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/40 to-black">
          {/* Particules flottantes violettes */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Effet de scan lumineux violet */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent transform transition-transform duration-2000 ${
            isMobileMenuOpen ? 'translate-x-full' : '-translate-x-full'
          }`} />
        </div>

        {/* Bordure néon violette animée */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
        
        <div className="relative z-10 px-4 py-6 space-y-3 backdrop-blur-xl border-t border-purple-500/30">
          {navLinks.map(({ href, label, icon, gradient }, index) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-500 transform hover:scale-105 overflow-hidden ${
                location === href 
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/50' 
                  : 'text-white/80 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-violet-600/30 hover:text-white backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50'
              }`}
              onClick={() => {
                playClickSound();
                vibrate();
                setIsMobileMenuOpen(false);
              }}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Icône avec effet */}
              <span className={`relative z-10 text-purple-400 group-hover:text-violet-300 transition-all duration-300 group-hover:scale-125 ${
                location === href ? 'text-white' : ''
              }`}>
                {icon}
              </span>
              
              {/* Texte avec effet */}
              <span className="relative z-10 font-semibold tracking-wide group-hover:tracking-wider transition-all duration-300">
                {label}
              </span>
              
              {/* Particules au survol */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              <div className="absolute bottom-2 left-8 w-0.5 h-0.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.2s'}} />
            </Link>
          ))}
          
          {/* Menu utilisateur mobile */}
          {isAuthenticated && user && (
            <>
              <div className="border-t border-neon-purple/20 pt-4 mt-4">
                <div className="flex items-center gap-3 px-6 py-3">
                  <img
                    src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                    alt={`Avatar de ${user.username}`}
                    className="w-8 h-8 rounded-full object-cover border border-neon-purple/30"
                  />
                  <div>
                    <p className="font-bold text-white">{user.username}</p>
                    <p className="text-xs text-neon-purple">{user.isAdmin ? 'Administrateur' : 'Membre'}</p>
                  </div>
                </div>
                
                <Link href="/profile" className="flex items-center gap-4 py-3 px-6 text-light-gray hover:text-white transition-colors">
                  <User className="h-4 w-4" />
                  <span>Mon Profil</span>
                </Link>
                
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-4 py-3 px-6 text-neon-purple hover:text-electric-blue transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                
                <button 
                  onClick={() => logout.mutate()}
                  className="flex items-center gap-4 py-3 px-6 text-light-gray hover:text-white transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}