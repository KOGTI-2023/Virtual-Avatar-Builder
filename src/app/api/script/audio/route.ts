import { NextResponse } from 'next/server';
import { ScriptService } from '@/services/scriptService';

const scriptService = new ScriptService();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ message: 'Keine Audiodatei hochgeladen' }, { status: 400 });
    }

    const scriptInput = await scriptService.processAudioInput(audioFile);
    return NextResponse.json(scriptInput, { status: 200 });
  } catch (error: any) {
    console.error('Fehler bei der Audioverarbeitung:', error);
    return NextResponse.json({ message: 'Fehler bei der Audioverarbeitung', error: error.message }, { status: 500 });
  }
}