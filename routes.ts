import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { discordBot } from "./discord-bot";
import cookieParser from "cookie-parser";

// Routes publiques simplifiées pour S.L.Z Guild
export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  
  // Route pour récupérer les membres Discord
  app.get("/api/discord/members", async (req: Request, res: Response) => {
    try {
      const members = await discordBot.getMembers();
      res.json(members);
    } catch (error) {
      console.error("Erreur lors de la récupération des membres:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Route pour récupérer les annonces Discord
  app.get("/api/discord/announcements", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const announcements = await discordBot.getAnnouncements(limit);
      res.json(announcements);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Route pour récupérer les statistiques du serveur
  app.get("/api/discord/stats", async (req: Request, res: Response) => {
    try {
      const stats = await discordBot.getServerStats();
      res.json(stats);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Route pour vérifier le statut d'un membre
  app.get("/api/discord/member/:username", async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const memberInfo = await discordBot.getMemberInfo(username);
      res.json(memberInfo);
    } catch (error) {
      console.error("Erreur lors de la vérification du membre:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Route de santé pour vérifier le serveur
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", message: "S.L.Z Guild Server is running" });
  });

  // Initialisation du bot Discord
  try {
    await discordBot.login();
    console.log("Bot Discord connecté avec succès");
  } catch (error) {
    console.error("Erreur de connexion Discord:", error);
  }

  const httpServer = createServer(app);
  return httpServer;
}