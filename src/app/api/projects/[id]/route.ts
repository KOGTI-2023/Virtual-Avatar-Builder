import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

const projectService = new ProjectService();

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function GET(_request: NextRequest, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const project = await projectService.getProject(id);
    if (!project) {
      return NextResponse.json({ message: 'Projekt nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error('Fehler beim Abrufen des Projekts:', error);
    return NextResponse.json(
      { message: 'Fehler beim Abrufen des Projekts', error: toErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const updates = await request.json();
    const updatedProject = await projectService.updateProject(id, updates);
    if (!updatedProject) {
      return NextResponse.json({ message: 'Projekt nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(updatedProject);
  } catch (error: unknown) {
    console.error('Fehler beim Aktualisieren des Projekts:', error);
    return NextResponse.json(
      { message: 'Fehler beim Aktualisieren des Projekts', error: toErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await projectService.deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Projekt nicht gefunden oder konnte nicht gelöscht werden' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Projekt erfolgreich gelöscht' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Fehler beim Löschen des Projekts:', error);
    return NextResponse.json(
      { message: 'Fehler beim Löschen des Projekts', error: toErrorMessage(error) },
      { status: 500 }
    );
  }
}
