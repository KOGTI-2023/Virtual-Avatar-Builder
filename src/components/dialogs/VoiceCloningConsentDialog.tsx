"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VoiceCloningConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consentToken: string) => void;
  onCancel: () => void;
}

export const VoiceCloningConsentDialog: React.FC<VoiceCloningConsentDialogProps> = ({
  isOpen,
  onClose,
  onConsent,
  onCancel,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [consentTokenInput, setConsentTokenInput] = useState('');

  const handleConsent = () => {
    if (agreedToTerms && consentTokenInput.trim()) {
      onConsent(consentTokenInput.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Zustimmung zum Stimmenklonen</AlertDialogTitle>
          <AlertDialogDescription>
            Um Ihre Stimme zu klonen, benötigen wir Ihre ausdrückliche Zustimmung. Bitte lesen Sie die folgenden Bedingungen sorgfältig durch:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Ihre Stimmaufnahme wird verwendet, um ein KI-Modell zu trainieren, das Ihre Stimme nachahmt.</li>
              <li>Wir werden Ihre geklonte Stimme nicht für illegale, unethische oder schädliche Zwecke verwenden.</li>
              <li>Das Klonen von Stimmen von Prominenten oder anderen Personen ohne deren ausdrückliche Zustimmung ist strengstens untersagt.</li>
              <li>Ihre Stimmdaten werden lokal verarbeitet und gespeichert, es sei denn, Sie entscheiden sich explizit für die Nutzung eines externen Dienstes.</li>
              <li>Sie können Ihre Zustimmung jederzeit widerrufen und Ihre Stimmdaten löschen lassen.</li>
            </ul>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
              />
              <Label htmlFor="terms">
                Ich habe die Bedingungen gelesen und stimme ihnen zu.
              </Label>
            </div>
            <div className="mt-4">
              <Label htmlFor="consent-token">
                Bitte geben Sie einen eindeutigen Zustimmungstoken ein (z.B. Ihren Namen oder eine zufällige Zeichenfolge), um Ihre Zustimmung zu bestätigen:
              </Label>
              <Input
                id="consent-token"
                className="mt-2"
                value={consentTokenInput}
                onChange={(e) => setConsentTokenInput(e.target.value)}
                placeholder="MeinName123"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleConsent} disabled={!agreedToTerms || !consentTokenInput.trim()}>
            Zustimmen und Stimme klonen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};