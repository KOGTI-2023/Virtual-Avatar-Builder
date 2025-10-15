import { NextResponse } from 'next/server';
import { StyleService } from '@/services/styleService';

const styleService = new StyleService();

export async function GET() {
  try {
    const styles = styleService.getAvailableStyles();
    const backgrounds = styleService.getAvailableBackgrounds();
    return NextResponse.json({ styles, backgrounds });
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Stile:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen der Stile', error: error.message }, { status: 500 });
  }
}