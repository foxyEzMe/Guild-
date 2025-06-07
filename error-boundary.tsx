import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-pure-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Icône d'erreur */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Message d'erreur */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Oups ! Une erreur s'est produite
            </h1>
            
            <p className="text-light-gray mb-8 leading-relaxed">
              Nous rencontrons un problème technique temporaire. 
              Nos équipes travaillent pour résoudre cela rapidement.
            </p>

            {/* Détails de l'erreur (en mode développement) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
                <h3 className="text-red-400 font-semibold mb-2">Détails de l'erreur :</h3>
                <code className="text-sm text-red-300 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReload}
                className="flex items-center gap-2 bg-gradient-to-r from-neon-purple to-electric-blue hover:from-electric-blue hover:to-neon-purple transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Recharger la page
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex items-center gap-2 border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
              >
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </div>

            {/* Contact support */}
            <div className="mt-8 pt-6 border-t border-neon-purple/20">
              <p className="text-sm text-light-gray/80">
                Si le problème persiste, contactez notre{' '}
                <a 
                  href="mailto:support@arisecrossover.com" 
                  className="text-neon-purple hover:text-electric-blue transition-colors"
                >
                  support technique
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Composant pour les erreurs de réseau/API
export function NetworkError({ 
  message = "Connexion impossible", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Problème de connexion</h3>
      <p className="text-light-gray mb-4">{message}</p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  );
}