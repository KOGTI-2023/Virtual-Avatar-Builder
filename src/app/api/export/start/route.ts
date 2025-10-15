import { NextResponse } from 'next/server';
import { ExportService } from '@/services/exportService';
import { ExportOptions, RenderResult } from '@/types/avatar-builder.d';

const exportService = new ExportService();

export async function POST(request: Request) {
  try {
    const { renderResult, options }: { renderResult: RenderResult; options: ExportOptions } = await request.json();
    if (!renderResult || !options) {
      return NextResponse.json({ message: 'Ungültige Export-Anfrage: Fehlende Parameter' }, { status: 400 });
    }

    const exportResult = await exportService.exportRender(renderResult, options);
    return NextResponse.json(exportResult, { status: 200 });
  } catch (error: any) {
    console.error('Fehler beim Starten des Exports:', error);
    return NextResponse.json({ message: 'Fehler beim Starten des Exports', error: error.message }, { status: 500 });
  }
}