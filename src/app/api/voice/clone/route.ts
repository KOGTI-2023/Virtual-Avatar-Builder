import { NextResponse } from 'next/server';
import { VoiceService } from '@/services/voiceService';

const voiceService = new VoiceService();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const consentToken = formData.get('consentToken') as string;

    if (!audioFile || !consentToken) {
      return NextResponse.json({ message: 'Audiodatei und Zustimmungstoken sind erforderlich' }, { status: 400 });
    }

    const clonedVoice = await voiceService.cloneVoice(audioFile, consentToken);
    return NextResponse.json(clonedVoice, { status: 200 });
  } catch (error: any) {
    console.error('Fehler beim Klonen der Stimme:', error);
    return NextResponse.json({ message: 'Fehler beim Klonen der Stimme', error: error.message }, { status: 500 });
  }
}