// Code and comments in English only
import { ScriptInput } from '@/types/avatar-builder';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');

export class ScriptService {
  constructor() {
    fs.mkdir(AUDIO_DIR, { recursive: true }).catch(console.error);
  }

  async processTextInput(text: string): Promise<ScriptInput> {
    // Simple text processing, generate mock subtitles
    const subtitles = this.generateMockSubtitles(text);
    return { text, transcript: text, subtitles };
  }

  async processAudioInput(audioFile: File): Promise<ScriptInput> {
    const audioId = uuidv4();
    const fileExtension = path.extname(audioFile.name);
    const filePath = path.join(AUDIO_DIR, `${audioId}${fileExtension}`);

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Mock STT and subtitle generation
    const mockTranscript = "Dies ist ein Beispiel-Transkript aus der Audioaufnahme.";
    const mockSubtitles = this.generateMockSubtitles(mockTranscript);

    return {
      audioId,
      transcript: mockTranscript,
      subtitles: mockSubtitles,
    };
  }

  private generateMockSubtitles(text: string): string {
    // Very basic mock SRT generation
    const words = text.split(' ');
    let srt = '';
    let time = 0;
    let subtitleIndex = 1;

    for (let i = 0; i < words.length; i += 5) { // Group 5 words per subtitle line
      const line = words.slice(i, i + 5).join(' ');
      if (line) {
        const startTime = new Date(time * 1000).toISOString().substr(11, 12).replace('.', ',');
        time += Math.min(line.length * 0.1, 2); // Simulate duration
        const endTime = new Date(time * 1000).toISOString().substr(11, 12).replace('.', ',');
        srt += `${subtitleIndex}\n${startTime} --> ${endTime}\n${line}\n\n`;
        subtitleIndex++;
      }
    }
    return srt;
  }
}
