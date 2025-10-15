import { NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

const projectService = new ProjectService();

export async function GET() {
  try {
    const projects = await projectService.listProjects();
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Projekte:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen der Projekte', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Projektname ist erforderlich' }, { status: 400 });
    }
    const newProject = await projectService.createProject(name);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Fehler beim Erstellen des Projekts:', error);
    return NextResponse.json({ message: 'Fehler beim Erstellen des Projekts', error: error.message }, { status: 500 });
  }
}