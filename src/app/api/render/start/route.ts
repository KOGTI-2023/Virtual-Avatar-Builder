import { NextResponse } from 'next/server';
import { RenderService } from '@/services/renderService';
import { RenderRequest } from '@/types/avatar-builder.d';

const renderService = new RenderService();

export async function POST(request: Request) {
  try {
    const renderRequest: RenderRequest = await request.json();
    if (!renderRequest.assetId || !renderRequest.script || !renderRequest.voice || !renderRequest.style) {
      return NextResponse.json({ message: 'Ungültige Render-Anfrage: Fehlende Parameter' }, { status: 400 });
    }

    const renderResult = await renderService.startRender(renderRequest);
    return NextResponse.json(renderResult, { status: 200 });
  } catch (error: any) {
    console.error('Fehler beim Starten des Renderings:', error);
    return NextResponse.json({ message: 'Fehler beim Starten des Renderings', error: error.message }, { status: 500 });
  }
}