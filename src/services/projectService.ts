// Code and comments in English only
import { getDb } from '@/lib/database';
import { Project } from '@/types/avatar-builder';
import { v4 as uuidv4 } from 'uuid';

export class ProjectService {
  async createProject(name: string): Promise<Project> {
    const db = await getDb();
    const newProject: Project = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    if (!db.data) {
      db.data = { examples: [], projects: [] };
    }
    db.data.projects.push(newProject);
    await db.write();
    return newProject;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const db = await getDb();
    await db.read(); // Ensure data is fresh
    return db.data?.projects.find(p => p.id === id);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const db = await getDb();
    if (!db.data) {
      db.data = { examples: [], projects: [] };
    }
    const projectIndex = db.data?.projects.findIndex(p => p.id === id);

    if (projectIndex !== undefined && projectIndex > -1 && db.data) {
      db.data.projects[projectIndex] = {
        ...db.data.projects[projectIndex],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      await db.write();
      return db.data.projects[projectIndex];
    }
    return undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const db = await getDb();
    if (!db.data) {
      db.data = { examples: [], projects: [] };
    }
    const initialLength = db.data.projects.length;
    db.data.projects = db.data.projects.filter(p => p.id !== id);
    await db.write();
    return db.data.projects.length < initialLength;
  }

  async listProjects(): Promise<Project[]> {
    const db = await getDb();
    await db.read();
    if (!db.data) {
      db.data = { examples: [], projects: [] };
      await db.write();
    }
    return db.data.projects;
  }
}
