// Code and comments in English only
import { ExportOptions, ExportResult, RenderResult } from '@/types/avatar-builder';
import path from 'path';
import fs from 'fs/promises';

const EXPORT_OUTPUT_DIR = path.resolve(process.cwd(), 'public/exports');

export class ExportService {
  constructor() {
    fs.mkdir(EXPORT_OUTPUT_DIR, { recursive: true }).catch(console.error);
  }

  async exportRender(renderResult: RenderResult, options: ExportOptions): Promise<ExportResult> {
    const { renderId, previewUrl } = renderResult;
    const previewRelativePath = previewUrl.startsWith('/') ? previewUrl.slice(1) : previewUrl;
    const { name: baseFileName, ext } = path.parse(previewRelativePath);
    const resolvedPreviewPath = path.join(process.cwd(), 'public', previewRelativePath);

    if (!ext) {
      throw new Error(`Unsupported preview URL format for render ${renderId}: ${previewUrl}`);
    }

    const videoUrl = `/exports/${baseFileName}${ext}`;
    let subtitlesUrl: string | undefined;
    let pngSequenceUrl: string | undefined;

    // Simulate copying the video to export directory
    try {
      await fs.access(resolvedPreviewPath);
    } catch (error) {
      throw new Error(`Render preview not found at ${resolvedPreviewPath}: ${(error as Error).message}`);
    }
    const destVideoPath = path.join(EXPORT_OUTPUT_DIR, `${baseFileName}${ext}`);
    await fs.copyFile(resolvedPreviewPath, destVideoPath);

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
