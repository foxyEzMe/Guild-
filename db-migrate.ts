import { db } from '../server/db';

// Script pour mettre à jour les champs requis pour l'inscription
async function main() {
  try {
    console.log('Mise à jour du schéma pour rendre l\'inscription plus robuste...');

    // Ajouter les colonnes nécessaires si elles n'existent pas
    await db.execute(`
      -- Vérifier et ajouter les champs manquants pour l'inscription et les profils utilisateurs
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS discord_id TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS discord_avatar TEXT,
      ADD COLUMN IF NOT EXISTS discord_username TEXT,
      ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS chat_access BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verification_token TEXT;
    `);

    console.log('Migration terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
}

main();