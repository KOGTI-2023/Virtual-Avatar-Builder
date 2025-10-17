// Code and comments in English only
import { UploadResult, AssetKind } from '@/types/avatar-builder';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads'); // Store uploads in public for easy access

export class IngestService {
  constructor() {
    // Ensure upload directory exists
    fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);
  }

  async uploadAsset(file: File): Promise<UploadResult> {
    const assetId = uuidv4();
    const fileExtension = path.extname(file.name);
    const filePath = path.join(UPLOAD_DIR, `${assetId}${fileExtension}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const kind: AssetKind = file.type.startsWith('image/') ? 'image' : 'video';
    let durationSec: number | undefined;

    // Mock quality check for now
    const quality = {
      faceDetected: true, // Assume face detected for mock
      sharpness: 0.9,     // Assume good sharpness for mock
      notes: [],
    };

    if (kind === 'video') {
      // In a real implementation, use ffmpeg or similar to get video duration
      durationSec = 5; // Mock duration for video
      if (file.size > 10 * 1024 * 1024) { // Example: 10MB limit
        quality.notes.push('Video file is large, processing might take longer.');
      }
    } else {
      if (file.size > 5 * 1024 * 1024) { // Example: 5MB limit
        quality.notes.push('Image file is large, processing might take longer.');
      }
    }

    return {
      assetId,
      kind,
      durationSec,
      quality,
    };
  }

  getAssetPath(assetId: string, kind: AssetKind, extension: string): string {
    // This would need to be more robust to handle different extensions
    // For simplicity, assuming we store original extension
    return `/uploads/${assetId}${extension}`; // Public URL path
  }
}
