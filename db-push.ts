import { db } from '../server/db';
import * as schema from '../shared/schema';

// This script will push the schema to the database
async function main() {
  console.log('Pushing schema to database...');
  
  try {
    // Create all tables from schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        discord_id TEXT UNIQUE,
        discord_avatar TEXT,
        discord_username TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        badges TEXT[],
        chat_access BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        role TEXT DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT,
        security_question TEXT,
        security_answer TEXT
      );

      CREATE TABLE IF NOT EXISTS discord_members (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        display_name TEXT,
        avatar TEXT,
        roles TEXT[],
        joined_at TIMESTAMP WITH TIME ZONE,
        bot BOOLEAN DEFAULT FALSE,
        online_status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        author_id TEXT NOT NULL,
        author_avatar TEXT,
        author_roles TEXT[],
        channel_id TEXT NOT NULL,
        message_id TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reactions INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS login_logs (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        location TEXT,
        success BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  }
}

main();