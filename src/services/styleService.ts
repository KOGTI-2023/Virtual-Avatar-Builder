// Code and comments in English only
import { StyleSpec, AvailableStyle, AvailableBackground } from '@/types/avatar-builder';

export class StyleService {
  private availableStyles: AvailableStyle[] = [
    { id: 'photoreal', name: 'Fotorealistisch', description: 'Ein realistischer Avatar-Stil.' },
    { id: 'toon', name: 'Cartoon', description: 'Ein animierter, zeichentrickartiger Stil.' },
    { id: 'line', name: 'Linienzeichnung', description: 'Ein minimalistischer Stil mit klaren Linien.' },
  ];

  private availableBackgrounds: AvailableBackground[] = [
    { id: 'solid', name: 'Einfarbig', description: 'Ein einfarbiger Hintergrund.' },
    { id: 'image', name: 'Bild', description: 'Ein benutzerdefiniertes Hintergrundbild.' },
    { id: 'transparent', name: 'Transparent', description: 'Ein transparenter Hintergrund (für Overlay).' },
  ];

  getAvailableStyles(): AvailableStyle[] {
    return this.availableStyles;
  }

  getAvailableBackgrounds(): AvailableBackground[] {
    return this.availableBackgrounds;
  }

  // In a real app, this might involve validating image IDs or color formats
  validateStyle(style: StyleSpec): boolean {
    if (!this.availableStyles.some(s => s.id === style.look)) return false;
    if (!this.availableBackgrounds.some(b => b.id === style.background)) return false;

    if (style.background === 'solid' && !style.bgColor) return false;
    if (style.background === 'image' && !style.bgImageId) return false;

    return true;
  }
}
