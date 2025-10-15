import { NextResponse } from 'next/server';
import { ScriptService } from '@/services/scriptService';

const scriptService = new ScriptService();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ message: 'Text ist erforderlich' }, { status: 400 });
    }

    const scriptInput = await scriptService.processTextInput(text);
    return NextResponse.json(scriptInput, { status: 200 });
  } catch (error: any) {
    console.error('Fehler bei der Textverarbeitung:', error);
    return NextResponse.json({ message: 'Fehler bei der Textverarbeitung', error: error.message }, { status: 500 });
  }
}