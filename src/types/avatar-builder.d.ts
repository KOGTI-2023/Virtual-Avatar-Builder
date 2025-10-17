// Code and comments in English only

export type AssetKind = 'image' | 'video';

export interface AssetQuality {
  faceDetected: boolean;
  sharpness: number;   // normalized 0..1
  notes: string[];
}

export interface UploadResult {
  assetId: string;
  kind: AssetKind;
  durationSec?: number;
  quality: AssetQuality;
}

export interface ScriptInput {
  text?: string;
  audioId?: string;      // recorded mic input
  transcript?: string;   // STT result
  subtitles?: string;    // SRT or VTT content
}

export interface VoiceSpec {
  id: string;            // prebuilt voice id
  cloned?: boolean;
  consentToken?: string; // required if cloned === true
}

export interface StyleSpec {
  look: 'photoreal' | 'toon' | 'line';
  background: 'solid' | 'image' | 'transparent';
  bgColor?: string;
  bgImageId?: string;
}

export interface AvailableStyle {
  id: StyleSpec['look'];
  name: string;
  description: string;
}

export interface AvailableBackground {
  id: StyleSpec['background'];
  name: string;
  description: string;
}

export interface RenderRequest {
  assetId: string;
  script: ScriptInput;
  voice: VoiceSpec;
  style: StyleSpec;
  durationLimitSec: number; // Changed from 90 to number for flexibility, though 90 is the target
  watermark: boolean;    // "AI-generated" if true
}

export interface RenderProgress {
  phase: string;
  progress: number; // 0-100
  message: string;
}

export interface RenderResult {
  renderId: string;
  previewUrl: string;
  durationSec: number;
}

export interface ExportOptions {
  format: 'mp4'; // Only mp4 for now
  withSubtitles: boolean;
  alsoPngSequence: boolean;
}

export interface ExportResult {
  videoUrl: string;
  subtitlesUrl?: string;
  pngSequenceUrl?: string;
}

export interface PrebuiltVoice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
}

// Project structure for lowdb
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  asset?: UploadResult;
  script?: ScriptInput;
  voice?: VoiceSpec;
  style?: StyleSpec;
  latestRender?: RenderResult;
}

// Extend DbSchema for lowdb
export interface DbSchema {
  examples: { id: number; name: string; createdAt: string }[];
  projects: Project[]; // Add projects collection
}
