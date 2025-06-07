import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Base de données optionnelle pour le mode sans authentification
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/slz_guild';

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });