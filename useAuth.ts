import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Type pour les données utilisateur
export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  discordId?: string;
  discordAvatar?: string;
  discordUsername?: string;
  level?: number;
  xp?: number;
  badges?: string[];
  chatAccess?: boolean;
  isAdmin: boolean;
  role: string;
}

// Type pour la connexion
export interface LoginCredentials {
  username: string;
  password: string;
}

// Type pour l'inscription
export interface RegisterData extends LoginCredentials {
  email?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword: string;
}

// Hook pour gérer l'authentification
export function useAuth() {
  const queryClient = useQueryClient();

  // Récupérer l'utilisateur courant
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutation pour la connexion
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la connexion");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalider la requête pour recharger l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  // Mutation pour l'inscription
  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'inscription");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalider la requête pour recharger l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  // Mutation pour la déconnexion
  const logout = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la déconnexion");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalider la requête pour recharger l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    register,
    logout,
  };
}