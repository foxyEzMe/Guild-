import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation-clean";
import { ParticleBackground } from "@/components/particle-background";
import { Footer } from "@/components/footer";
import { ThemeSwitcherFloating } from "@/components/theme-switcher-floating";

import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeCustomizationProvider } from "@/contexts/ThemeCustomizationContext";
import { Loading3DSpectacular } from "@/components/loading-3d-spectacular";
import { useState, useEffect } from "react";
import Home from "@/pages/home";
import Members from "@/pages/members-enhanced";
import Announcements from "@/pages/announcements-discord-sync";
import Credits from "@/pages/credits";
import ChatDiscord from "@/pages/chat-discord";
import Admin from "@/pages/admin-secure";
import NotFound from "@/pages/not-found";
import Events from "@/pages/events";
import AdminStats from "@/pages/admin-stats";

function Router() {
  const [location] = useLocation();
  
  // Ne pas afficher la navigation et le footer sur la page d'administration
  const isAdminPage = location === "/admin" || location === "/admin/stats";
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/credits" component={Credits} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/stats" component={AdminStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminPage = location === "/admin" || location === "/admin/stats";
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('app-first-load-complete');
  });

  useEffect(() => {
    if (isLoading && !sessionStorage.getItem('app-first-load-complete')) {
      const loadTimer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('app-first-load-complete', 'true');
      }, 3500); // Extended loading time for better effect

      return () => clearTimeout(loadTimer);
    } else if (sessionStorage.getItem('app-first-load-complete')) {
      setIsLoading(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <ThemeCustomizationProvider>
            <TooltipProvider>
            <div className="min-h-screen bg-near-black dark:bg-black text-white transition-colors duration-500">
              {/* Écran de chargement 3D */}
              <Loading3DSpectacular 
                isLoading={isLoading} 
                onComplete={() => setIsLoading(false)}
              />
              
              {/* Contenu principal (affiché après le chargement) */}
              {!isLoading && (
                <>
                  {!isAdminPage && <ParticleBackground />}
                  {!isAdminPage && (
                    <header role="banner">
                      <Navigation />
                    </header>
                  )}
                  <main className="relative z-10" role="main">
                    <Router />
                  </main>
                  {!isAdminPage && (
                    <footer role="contentinfo">
                      <Footer />
                    </footer>
                  )}
                  <ThemeSwitcherFloating />
                </>
              )}
            </div>
            <Toaster />
            </TooltipProvider>
          </ThemeCustomizationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
