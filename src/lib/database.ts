import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { DbSchema } from '@/types/avatar-builder.d'; // Import DbSchema from the new types file

// Define the path for the JSON database file
const DB_FILE_NAME = 'db.json';
const DB_DIR_PATH = process.env.DATABASE_DIR || './data';
const DB_FULL_PATH = path.resolve(process.cwd(), DB_DIR_PATH, DB_FILE_NAME);

let dbInstance: Low<DbSchema> | null = null;

/**
 * Initializes and returns a singleton Lowdb database instance.
 * If the database file doesn't exist, it will be created with default data.
 * @returns {Promise<Low<DbSchema>>} The database instance.
 */
export async function getDb(): Promise<Low<DbSchema>> {
  if (dbInstance) {
    if (dbInstance.data) {
      return dbInstance;
    }
    await dbInstance.read();
    return dbInstance;
  }

  try {
    // Ensure the directory for the database file exists
    const dir = path.dirname(DB_FULL_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const adapter = new JSONFile<DbSchema>(DB_FULL_PATH);
    // Provide initial generic structure for the template, including projects
    dbInstance = new Low<DbSchema>(adapter, { examples: [], projects: [] });

    await dbInstance.read();

    console.log(`Database initialized/loaded from: ${DB_FULL_PATH}`);

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize Lowdb database:', error);
    throw error;
  }
}