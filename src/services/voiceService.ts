// Code and comments in English only
import { VoiceSpec } from '@/types/avatar-builder.d';
import { v4 as uuidv4 } from 'uuid';

export interface PrebuiltVoice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
}

export class VoiceService {
  private prebuiltVoices: PrebuiltVoice[] = [
    { id: 'voice-1', name: 'Standard Male', description: 'Eine klare männliche Stimme.', gender: 'male', language: 'de-DE' },
    { id: 'voice-2', name: 'Standard Female', description: 'Eine freundliche weibliche Stimme.', gender: 'female', language: 'de-DE' },
    { id: 'voice-3', name: 'Deep Male', description: 'Eine tiefe, resonante männliche Stimme.', gender: 'male', language: 'en-US' },
    { id: 'voice-4', name: 'Soft Female', description: 'Eine sanfte, beruhigende weibliche Stimme.', gender: 'female', language: 'en-US' },
  ];

  getPrebuiltVoices(): PrebuiltVoice[] {
    return this.prebuiltVoices;
  }

  async cloneVoice(audioFile: File, consentToken: string): Promise<VoiceSpec> {
    // In a real implementation, this would involve:
    // 1. Sending audio to a TTS service for cloning (if user opted in for external service)
    // 2. Storing the cloned voice model ID
    // 3. Validating consentToken

    if (!consentToken) {
      throw new Error('Consent token is required for voice cloning.');
    }

    // Mock check for celebrity voice (very basic, real implementation would use AI)
    const isCelebrityVoice = audioFile.size > 1024 * 1024 && audioFile.name.includes('celebrity'); // Mock check
    if (isCelebrityVoice) {
      throw new Error('Celebrity voice cloning is not allowed.');
    }

    const clonedVoiceId = `cloned-${uuidv4()}`;
    console.log(`Mock voice cloning successful for ID: ${clonedVoiceId}`);

    return {
      id: clonedVoiceId,
      cloned: true,
      consentToken,
    };
  }
}