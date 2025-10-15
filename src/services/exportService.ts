// Code and comments in English only
import { ExportOptions, ExportResult, RenderResult } from '@/types/avatar-builder.d';
import path from 'path';
import fs from 'fs/promises';

const EXPORT_OUTPUT_DIR = path.resolve(process.cwd(), 'public/exports');

export class ExportService {
  constructor() {
    fs.mkdir(EXPORT_OUTPUT_DIR, { recursive: true }).catch(console.error);
  }

  async exportRender(renderResult: RenderResult, options: ExportOptions): Promise<ExportResult> {
    const { renderId, previewUrl } = renderResult;
    const baseFileName = path.basename(previewUrl, '.mp4'); // Assuming previewUrl is an MP4

    const videoUrl = `/exports/${baseFileName}.mp4`;
    let subtitlesUrl: string | undefined;
    let pngSequenceUrl: string | undefined;

    // Simulate copying the video to export directory
    const sourcePath = path.join(process.cwd(), 'public', previewUrl);
    const destVideoPath = path.join(EXPORT_OUTPUT_DIR, `${baseFileName}.mp4`);
    await fs.copyFile(sourcePath, destVideoPath);

    if (options.withSubtitles) {
      // Mock subtitle file creation
      subtitlesUrl = `/exports/${baseFileName}.srt`;
      const destSubtitlesPath = path.join(EXPORT_OUTPUT_DIR, `${baseFileName}.srt`);
      await fs.writeFile(destSubtitlesPath, '1\n00:00:00,000 --> 00:00:02,000\nMock Untertitel');
    }

    if (options.alsoPngSequence) {
      // Mock PNG sequence creation (e.g., a zip file of images)
      pngSequenceUrl = `/exports/${baseFileName}_frames.zip`;
      const destPngPath = path.join(EXPORT_OUTPUT_DIR, `${baseFileName}_frames.zip`);
      await fs.writeFile(destPngPath, 'mock png sequence zip content');
    }

    console.log(`Exported render ${renderId} with options:`, options);

    return {
      videoUrl,
      subtitlesUrl,
      pngSequenceUrl,
    };
  }
}