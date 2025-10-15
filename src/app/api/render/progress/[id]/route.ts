import { NextResponse } from 'next/server';
import { RenderService } from '@/services/renderService';

const renderService = new RenderService();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const progress = await renderService.getRenderProgress(id);
    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('Fehler beim Abrufen des Render-Fortschritts:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen des Render-Fortschritts', error: error.message }, { status: 500 });
  }
}