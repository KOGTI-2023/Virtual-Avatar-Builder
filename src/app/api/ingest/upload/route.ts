import { NextResponse } from 'next/server';
import { IngestService } from '@/services/ingestService';

const ingestService = new IngestService();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'Keine Datei hochgeladen' }, { status: 400 });
    }

    const uploadResult = await ingestService.uploadAsset(file);
    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error: any) {
    console.error('Fehler beim Hochladen des Assets:', error);
    return NextResponse.json({ message: 'Fehler beim Hochladen des Assets', error: error.message }, { status: 500 });
  }
}