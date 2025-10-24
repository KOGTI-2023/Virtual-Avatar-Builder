import { NextResponse } from 'next/server';
import { RenderService } from '@/services/renderService';

const renderService = new RenderService();

type RenderProgressContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RenderProgressContext) {
  try {
    const { id } = await context.params;
    const progress = await renderService.getRenderProgress(id);
    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('Fehler beim Abrufen des Render-Fortschritts:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen des Render-Fortschritts', error: error.message }, { status: 500 });
  }
}
