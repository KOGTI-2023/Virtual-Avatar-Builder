import { NextResponse } from 'next/server';
import { VoiceService } from '@/services/voiceService';

const voiceService = new VoiceService();

export async function GET() {
  try {
    const voices = voiceService.getPrebuiltVoices();
    return NextResponse.json(voices);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Stimmen:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen der Stimmen', error: error.message }, { status: 500 });
  }
}