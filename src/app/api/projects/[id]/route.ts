import { NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

const projectService = new ProjectService();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const project = await projectService.getProject(id);
    if (!project) {
      return NextResponse.json({ message: 'Projekt nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Fehler beim Abrufen des Projekts:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen des Projekts', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    const updatedProject = await projectService.updateProject(id, updates);
    if (!updatedProject) {
      return NextResponse.json({ message: 'Projekt nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren des Projekts:', error);
    return NextResponse.json({ message: 'Fehler beim Aktualisieren des Projekts', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await projectService.deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Projekt nicht gefunden oder konnte nicht gelöscht werden' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Projekt erfolgreich gelöscht' }, { status: 200 });
  } catch (error: any) {
    console.error('Fehler beim Löschen des Projekts:', error);
    return NextResponse.json({ message: 'Fehler beim Löschen des Projekts', error: error.message }, { status: 500 });
  }
}