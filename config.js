// POINT 18 : FICHIER DE CONFIGURATION CENTRALISÉ POUR ARISE CROSSOVER

const Config = {
  // === PARAMÈTRES AUDIO ===
  audio: {
    // Volume par défaut (0.0 à 1.0)
    defaultVolume: 0.5,
    
    // URL de la musique de fond
    backgroundMusicUrl: "/assets/audio/background-music.mp3",
    
    // Sons d'effets
    sounds: {
      click: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8",
      success: "data:audio/wav;base64,UklGRkwBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSgBAAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAu7u7u7u7u7u7u7u7u7u7u7u7",
      error: "data:audio/wav;base64,UklGRlIBAABXQVZFZm10IBAAAAABAAEAQKwAAEBAQAQRABAAZGF0YS4BAAA="
    },
    
    // Activation par défaut
    enabled: true,
    
    // Démarrage automatique (toujours false pour respecter les navigateurs)
    autoplay: false
  },

  // === LIENS DE REDIRECTION ===
  links: {
    // Liens principaux
    discord: "https://discord.gg/arisecrossover",
    trello: "https://trello.com/b/arisecrossover",
    
    // Réseaux sociaux
    social: {
      youtube: "https://youtube.com/@arisecrossover",
      twitter: "https://twitter.com/arisecrossover",
      instagram: "https://instagram.com/arisecrossover"
    },
    
    // Liens de jeu
    game: {
      robloxGroup: "https://www.roblox.com/groups/",
      mainGame: "https://www.roblox.com/games/"
    },
    
    // Pages internes
    internal: {
      home: "/",
      login: "/login",
      register: "/register",
      members: "/members",
      events: "/events",
      announcements: "/announcements",
      profile: "/profile",
      admin: "/admin"
    }
  },

  // === PARAMÈTRES D'INTERFACE ===
  ui: {
    // Animations
    animations: {
      // Durée des transitions (en ms)
      transitionDuration: 300,
      
      // Délai du loader (en ms)
      loaderDuration: 2000,
      
      // Animation du texte hero (en ms)
      heroTextInterval: 3000,
      
      // Particules
      particleCount: 50,
      reducedParticleCount: 20 // Pour mobile
    },
    
    // Thème
    theme: {
      // Couleurs principales
      colors: {
        primary: "#a855f7",
        secondary: "#3b82f6", 
        accent: "#06b6d4",
        background: "#000000",
        surface: "#1a1a1a"
      },
      
      // Mode sombre par défaut
      darkMode: true,
      
      // Réduction des animations sur mobile
      reduceMotion: true
    },
    
    // Navigation
    navigation: {
      // Affichage du menu mobile
      mobileBreakpoint: 768,
      
      // Délai avant fermeture automatique du menu
      autoCloseDelay: 5000
    }
  },

  // === PARAMÈTRES DE PERFORMANCE ===
  performance: {
    // Images
    images: {
      // Chargement paresseux
      lazyLoading: true,
      
      // Qualité de compression
      quality: 85
    },
    
    // Cache
    cache: {
      // Durée de cache des données (en ms)
      duration: 300000, // 5 minutes
      
      // Taille maximale du cache localStorage
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    
    // Optimisations mobile
    mobile: {
      // Réduction des particules
      reduceParticles: true,
      
      // Simplification des animations
      simplifyAnimations: true,
      
      // Compression des images
      compressImages: true
    }
  },

  // === PARAMÈTRES API ===
  api: {
    // URLs de base
    baseUrl: window.location.origin,
    
    // Endpoints
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      members: "/api/members",
      announcements: "/api/announcements",
      discord: "/api/discord"
    },
    
    // Timeouts (en ms)
    timeout: 10000,
    
    // Retry
    retryAttempts: 3,
    retryDelay: 1000
  },

  // === PARAMÈTRES DE SÉCURITÉ ===
  security: {
    // Validation des formulaires
    validation: {
      // Longueur minimale du mot de passe
      minPasswordLength: 6,
      
      // Longueur minimale du nom d'utilisateur
      minUsernameLength: 3,
      
      // Regex pour l'email
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    
    // Session
    session: {
      // Durée de session (en ms)
      duration: 24 * 60 * 60 * 1000, // 24 heures
      
      // Rafraîchissement automatique
      autoRefresh: true
    }
  },

  // === MESSAGES D'ERREUR ===
  messages: {
    errors: {
      // Erreurs de connexion
      networkError: "Problème de connexion. Vérifiez votre connexion internet.",
      serverError: "Erreur serveur. Veuillez réessayer plus tard.",
      authenticationError: "Identifiants invalides. Veuillez réessayer.",
      
      // Erreurs de validation
      invalidEmail: "Adresse email invalide.",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères.",
      usernameTooShort: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      
      // Erreurs génériques
      unknownError: "Une erreur inattendue s'est produite.",
      accessDenied: "Accès refusé. Vous n'avez pas les permissions nécessaires."
    },
    
    success: {
      // Messages de succès
      loginSuccess: "Connexion réussie ! Bienvenue.",
      registerSuccess: "Compte créé avec succès !",
      updateSuccess: "Informations mises à jour avec succès.",
      logoutSuccess: "Déconnexion réussie. À bientôt !"
    },
    
    loading: {
      // Messages de chargement
      authenticating: "Authentification en cours...",
      loading: "Chargement en cours...",
      saving: "Sauvegarde en cours...",
      updating: "Mise à jour en cours..."
    }
  },

  // === INFORMATIONS DE CONTACT ===
  contact: {
    // Email de support
    supportEmail: "support@arisecrossover.com",
    
    // Email administrateur
    adminEmail: "admin@arisecrossover.com",
    
    // Discord pour le support
    supportDiscord: "https://discord.gg/arisecrossover-support"
  },

  // === INFORMATIONS DE L'APPLICATION ===
  app: {
    // Nom de l'application
    name: "Arise Crossover",
    
    // Version
    version: "1.0.0",
    
    // Description
    description: "Guilde Elite Gaming - Excellence et Conquête",
    
    // Auteur
    author: "Team Arise Crossover",
    
    // Copyright
    copyright: "© 2024 Arise Crossover. Tous droits réservés."
  }
};

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
}

// Disponible globalement
window.AriseCrossoverConfig = Config;