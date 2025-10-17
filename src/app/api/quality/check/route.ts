import { NextResponse } from 'next/server';
import { QualityService } from '@/services/qualityService';
import { AssetKind } from '@/types/avatar-builder';

const qualityService = new QualityService();

export async function POST(request: Request) {
  try {
    const { assetPath, kind } = await request.json();
    if (!assetPath || !kind) {
      return NextResponse.json({ message: 'Asset-Pfad und Typ sind erforderlich' }, { status: 400 });
    }

    const qualityResult = await qualityService.performQualityChecks(assetPath, kind as AssetKind);
    return NextResponse.json(qualityResult, { status: 200 });
  } catch (error: any) {
    console.error('Fehler bei der Qualitätsprüfung:', error);
    return NextResponse.json({ message: 'Fehler bei der Qualitätsprüfung', error: error.message }, { status: 500 });
  }
}