"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  UploadResult,
  ScriptInput,
  VoiceSpec,
  StyleSpec,
  RenderRequest,
  RenderResult,
  ExportOptions,
  ExportResult,
  Project,
  PrebuiltVoice,
  AvailableStyle,
  AvailableBackground,
} from '@/types/avatar-builder';
import { VoiceCloningConsentDialog } from '@/components/dialogs/VoiceCloningConsentDialog';

type Step = 'upload' | 'script' | 'voice' | 'style' | 'render' | 'export';

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const PROJECT_CARD_CLASSES = 'w-full bg-black/60 border border-amber-400/30 text-amber-100 shadow-lg';
const STEP_SECTION_BASE_CLASSES = 'flex flex-col gap-4';
const HIGHLIGHT_PANEL_BASE_CLASSES = 'p-3 border border-amber-400/40 rounded-md bg-amber-500/10';

const StepSection = ({ children, className }: WrapperProps) => (
  <div className={cn(STEP_SECTION_BASE_CLASSES, className)}>{children}</div>
);

const HighlightPanel = ({ children, className }: WrapperProps) => (
  <div className={cn(HIGHLIGHT_PANEL_BASE_CLASSES, className)}>{children}</div>
);

const OptionRow = ({ children, className }: WrapperProps) => (
  <div className={cn('flex items-center space-x-2', className)}>{children}</div>
);

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [projectName, setProjectName] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Step 1: Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Step 2: Script State
  const [scriptInputType, setScriptInputType] = useState<'text' | 'audio'>('text');
  const [scriptText, setScriptText] = useState('');
  const [scriptAudioFile, setScriptAudioFile] = useState<File | null>(null);
  const [scriptResult, setScriptResult] = useState<ScriptInput | null>(null);
  const [isProcessingScript, setIsProcessingScript] = useState(false);

  // Step 3: Voice State
  const [prebuiltVoices, setPrebuiltVoices] = useState<PrebuiltVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [voiceSpec, setVoiceSpec] = useState<VoiceSpec | null>(null);
  const [isVoiceCloningConsentOpen, setIsVoiceCloningConsentOpen] = useState(false);
  const [clonedVoiceAudioFile, setClonedVoiceAudioFile] = useState<File | null>(null);
  const [isCloningVoice, setIsCloningVoice] = useState(false);

  // Step 4: Style State
  const [availableStyles, setAvailableStyles] = useState<AvailableStyle[]>([]);
  const [availableBackgrounds, setAvailableBackgrounds] = useState<AvailableBackground[]>([]);
  const [selectedLook, setSelectedLook] = useState<StyleSpec['look']>('photoreal');
  const [selectedBackground, setSelectedBackground] = useState<StyleSpec['background']>('solid');
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [styleSpec, setStyleSpec] = useState<StyleSpec | null>(null);

  // Step 5: Render State
  const [renderResult, setRenderResult] = useState<RenderResult | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderPhase, setRenderPhase] = useState('');
  const [renderMessage, setRenderMessage] = useState('');
  const [watermark, setWatermark] = useState(true);

  // Step 6: Export State
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'mp4',
    withSubtitles: true,
    alsoPngSequence: false,
  });
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const steps: Step[] = ['upload', 'script', 'voice', 'style', 'render', 'export'];

  const getStepTitle = (step: Step) => {
    switch (step) {
      case 'upload': return '1. Asset hochladen';
      case 'script': return '2. Skript eingeben';
      case 'voice': return '3. Stimme auswählen';
      case 'style': return '4. Visuellen Stil wählen';
      case 'render': return '5. Avatar rendern';
      case 'export': return '6. Exportieren';
    }
  };

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Project Management
  const createNewProject = async () => {
    if (!projectName.trim()) {
      toast.error('Bitte geben Sie einen Projektnamen ein.');
      return;
    }
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      });
      if (!response.ok) throw new Error('Fehler beim Erstellen des Projekts');
      const project: Project = await response.json();
      setCurrentProject(project);
      toast.success(`Projekt "${project.name}" erstellt.`);
    } catch (error: any) {
      toast.error(error.message || 'Projekt konnte nicht erstellt werden.');
    }
  };

  const updateCurrentProject = useCallback(async (updates: Partial<Project>) => {
    if (!currentProject?.id) return;
    try {
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Fehler beim Aktualisieren des Projekts');
      const updatedProject: Project = await response.json();
      setCurrentProject(updatedProject);
      toast.success('Projekt aktualisiert.');
    } catch (error: any) {
      toast.error(error.message || 'Projekt konnte nicht aktualisiert werden.');
    }
  }, [currentProject]);

  useEffect(() => {
    if (currentProject) {
      // Load project data into state
      setUploadResult(currentProject.asset || null);
      setScriptResult(currentProject.script || null);
      setVoiceSpec(currentProject.voice || null);
      setStyleSpec(currentProject.style || null);
      setRenderResult(currentProject.latestRender || null);

      if (currentProject.asset) {
        setSelectedFile(null); // Clear file input if asset loaded from project
      }
      if (currentProject.script?.text) {
        setScriptInputType('text');
        setScriptText(currentProject.script.text);
      } else if (currentProject.script?.audioId) {
        setScriptInputType('audio');
        setScriptAudioFile(null); // Clear file input if audio loaded from project
      }
      if (currentProject.voice?.id) {
        setSelectedVoiceId(currentProject.voice.id);
      }
      if (currentProject.style) {
        setSelectedLook(currentProject.style.look);
        setSelectedBackground(currentProject.style.background);
        if (currentProject.style.bgColor) setBackgroundColor(currentProject.style.bgColor);
        // backgroundImageFile would need to be re-uploaded or fetched
      }
    }
  }, [currentProject]);

  // Step 1: Upload Handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Bitte wählen Sie eine Datei zum Hochladen aus.');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/ingest/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Fehler beim Hochladen des Assets');
      const result: UploadResult = await response.json();
      setUploadResult(result);
      await updateCurrentProject({ asset: result });
      toast.success('Asset erfolgreich hochgeladen und Qualitätsprüfung durchgeführt.');
      handleNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Hochladen fehlgeschlagen.');
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2: Script Handlers
  const handleScriptAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setScriptAudioFile(event.target.files[0]);
    }
  };

  const handleProcessScript = async () => {
    setIsProcessingScript(true);
    try {
      let result: ScriptInput;
      if (scriptInputType === 'text') {
        if (!scriptText.trim()) {
          toast.error('Bitte geben Sie Text für das Skript ein.');
          return;
        }
        const response = await fetch('/api/script/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: scriptText }),
        });
        if (!response.ok) throw new Error('Fehler bei der Textverarbeitung');
        result = await response.json();
      } else { // audio
        if (!scriptAudioFile) {
          toast.error('Bitte wählen Sie eine Audiodatei für das Skript aus.');
          return;
        }
        const formData = new FormData();
        formData.append('audio', scriptAudioFile);
        const response = await fetch('/api/script/audio', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Fehler bei der Audioverarbeitung');
        result = await response.json();
      }
      setScriptResult(result);
      await updateCurrentProject({ script: result });
      toast.success('Skript erfolgreich verarbeitet.');
      handleNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Skriptverarbeitung fehlgeschlagen.');
    } finally {
      setIsProcessingScript(false);
    }
  };

  // Step 3: Voice Handlers
  useEffect(() => {
    const fetchPrebuiltVoices = async () => {
      try {
        const response = await fetch('/api/voice/prebuilt');
        if (!response.ok) throw new Error('Fehler beim Abrufen der Stimmen');
        const voices: PrebuiltVoice[] = await response.json();
        setPrebuiltVoices(voices);
        if (voices.length > 0 && !selectedVoiceId) {
          setSelectedVoiceId(voices[0].id);
        }
      } catch (error: any) {
        toast.error(error.message || 'Vordefinierte Stimmen konnten nicht geladen werden.');
      }
    };
    fetchPrebuiltVoices();
  }, [selectedVoiceId]);

  const handleSelectVoice = async () => {
    if (!selectedVoiceId) {
      toast.error('Bitte wählen Sie eine Stimme aus.');
      return;
    }
    const voice: VoiceSpec = { id: selectedVoiceId, cloned: false };
    setVoiceSpec(voice);
    await updateCurrentProject({ voice });
    toast.success('Stimme ausgewählt.');
    handleNextStep();
  };

  const handleCloneVoiceConsent = (consentToken: string) => {
    if (!clonedVoiceAudioFile) {
      toast.error('Keine Audiodatei für das Klonen der Stimme ausgewählt.');
      return;
    }
    setIsCloningVoice(true);
    const formData = new FormData();
    formData.append('audio', clonedVoiceAudioFile);
    formData.append('consentToken', consentToken);

    fetch('/api/voice/clone', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.message || 'Fehler beim Klonen der Stimme'); });
        return response.json();
      })
      .then((result: VoiceSpec) => {
        setVoiceSpec(result);
        updateCurrentProject({ voice: result });
        toast.success('Stimme erfolgreich geklont.');
        handleNextStep();
      })
      .catch((error: any) => {
        toast.error(error.message || 'Stimmenklonen fehlgeschlagen.');
      })
      .finally(() => {
        setIsCloningVoice(false);
        setIsVoiceCloningConsentOpen(false);
      });
  };

  // Step 4: Style Handlers
  useEffect(() => {
    const fetchAvailableStyles = async () => {
      try {
        const response = await fetch('/api/style/available');
        if (!response.ok) throw new Error('Fehler beim Abrufen der Stile');
        const { styles, backgrounds }: { styles: AvailableStyle[]; backgrounds: AvailableBackground[] } = await response.json();
        setAvailableStyles(styles);
        setAvailableBackgrounds(backgrounds);
        if (styles.length > 0 && !selectedLook) setSelectedLook(styles[0].id);
        if (backgrounds.length > 0 && !selectedBackground) setSelectedBackground(backgrounds[0].id);
      } catch (error: any) {
        toast.error(error.message || 'Verfügbare Stile konnten nicht geladen werden.');
      }
    };
    fetchAvailableStyles();
  }, [selectedLook, selectedBackground]);

  const handleSelectStyle = async () => {
    if (!selectedLook || !selectedBackground) {
      toast.error('Bitte wählen Sie einen Look und einen Hintergrund aus.');
      return;
    }

    const style: StyleSpec = {
      look: selectedLook,
      background: selectedBackground,
      bgColor: selectedBackground === 'solid' ? backgroundColor : undefined,
      // bgImageId would need to be handled via upload and stored
    };
    setStyleSpec(style);
    await updateCurrentProject({ style });
    toast.success('Stil ausgewählt.');
    handleNextStep();
  };

  // Step 5: Render Handlers
  const handleStartRender = async () => {
    if (!uploadResult || !scriptResult || !voiceSpec || !styleSpec) {
      toast.error('Bitte schließen Sie alle vorherigen Schritte ab, bevor Sie rendern.');
      return;
    }
    setIsRendering(true);
    setRenderProgress(0);
    setRenderPhase('Initialisierung');
    setRenderMessage('Rendering wird vorbereitet...');

    const renderRequest: RenderRequest = {
      assetId: uploadResult.assetId,
      script: scriptResult,
      voice: voiceSpec,
      style: styleSpec,
      durationLimitSec: uploadResult.durationSec || 90,
      watermark: watermark,
    };

    try {
      const response = await fetch('/api/render/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renderRequest),
      });
      if (!response.ok) throw new Error('Fehler beim Starten des Renderings');
      const result: RenderResult = await response.json();
      setRenderResult(result);
      await updateCurrentProject({ latestRender: result });
      toast.success('Rendering erfolgreich gestartet.');

      // Mock progress updates
      const phases = ['Animation', 'Audio', 'Video-Komposition', 'Kodierung', 'Abgeschlossen'];
      let currentMockProgress = 0;
      for (let i = 0; i < phases.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        currentMockProgress += (100 / phases.length);
        setRenderPhase(phases[i]);
        setRenderProgress(Math.min(currentMockProgress, 100));
        setRenderMessage(`Phase: ${phases[i]}...`);
      }
      setRenderProgress(100);
      setRenderPhase('Abgeschlossen');
      setRenderMessage('Rendering abgeschlossen!');
      toast.success('Rendering abgeschlossen!');
      handleNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Rendering fehlgeschlagen.');
    } finally {
      setIsRendering(false);
    }
  };

  // Step 6: Export Handlers
  const handleStartExport = async () => {
    if (!renderResult) {
      toast.error('Bitte rendern Sie zuerst den Avatar.');
      return;
    }
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renderResult, options: exportOptions }),
      });
      if (!response.ok) throw new Error('Fehler beim Starten des Exports');
      const result: ExportResult = await response.json();
      setExportResult(result);
      toast.success('Export erfolgreich abgeschlossen.');
      // No next step, this is the final step
    } catch (error: any) {
      toast.error(error.message || 'Export fehlgeschlagen.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-amber-600 text-amber-100 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl rounded-3xl bg-black/70 border border-amber-500/30 p-8 sm:p-12 shadow-2xl backdrop-blur">
        <h1 className="text-4xl font-bold text-center sm:text-left text-amber-100 drop-shadow-lg">Virtueller Avatar-Ersteller</h1>
        <p className="text-lg text-center sm:text-left text-amber-200/80">
          Erstellen Sie Ihren sprechenden Avatar in wenigen einfachen Schritten.
        </p>

        {!currentProject ? (
          <Card className={PROJECT_CARD_CLASSES}>
            <CardHeader>
              <CardTitle>Neues Projekt starten</CardTitle>
              <CardDescription>Geben Sie einen Namen für Ihr neues Avatar-Projekt ein.</CardDescription>
            </CardHeader>
            <CardContent className={STEP_SECTION_BASE_CLASSES}>
              <Input
                placeholder="Projektname"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Button onClick={createNewProject} disabled={!projectName.trim()}>
                Projekt erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className={PROJECT_CARD_CLASSES}>
            <CardHeader>
              <CardTitle>Projekt: {currentProject.name}</CardTitle>
              <CardDescription>Letzte Änderung: {new Date(currentProject.lastModified).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{getStepTitle(currentStep)}</h2>
                <div className="flex gap-2">
                  <Button onClick={handlePrevStep} disabled={steps.indexOf(currentStep) === 0} variant="outline">
                    Zurück
                  </Button>
                  {currentStep !== 'export' && (
                    <Button onClick={handleNextStep} disabled={steps.indexOf(currentStep) === steps.length - 1}>
                      Weiter
                    </Button>
                  )}
                </div>
              </div>

              {/* Step 1: Upload */}
              {currentStep === 'upload' && (
                <StepSection>
                  <Label htmlFor="asset-upload">Bild oder Video hochladen</Label>
                  <Input id="asset-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} />
                  {selectedFile && <p className="text-sm text-muted-foreground">Ausgewählte Datei: {selectedFile.name}</p>}
                  {uploadResult && (
                    <HighlightPanel className="mt-2">
                      <p className="text-sm font-medium">Asset hochgeladen:</p>
                      <p className="text-xs">ID: {uploadResult.assetId}</p>
                      <p className="text-xs">Typ: {uploadResult.kind}</p>
                      <p className="text-xs">Qualität: Gesicht erkannt: {uploadResult.quality.faceDetected ? 'Ja' : 'Nein'}, Schärfe: {(uploadResult.quality.sharpness * 100).toFixed(0)}%</p>
                      {uploadResult.quality.notes.length > 0 && (
                        <p className="text-xs text-amber-300">Hinweise: {uploadResult.quality.notes.join(', ')}</p>
                      )}
                      {uploadResult.kind === 'video' && uploadResult.durationSec && (
                        <p className="text-xs">Dauer: {uploadResult.durationSec} Sekunden</p>
                      )}
                    </HighlightPanel>
                  )}
                  <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                    {isUploading ? 'Wird hochgeladen...' : 'Hochladen & Prüfen'}
                  </Button>
                </StepSection>
              )}

              {/* Step 2: Script */}
              {currentStep === 'script' && (
                <StepSection>
                  <Label>Skript-Eingabeart</Label>
                  <Select value={scriptInputType} onValueChange={(value: 'text' | 'audio') => setScriptInputType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie die Eingabeart" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text eingeben</SelectItem>
                      <SelectItem value="audio">Audio aufnehmen/hochladen</SelectItem>
                    </SelectContent>
                  </Select>

                  {scriptInputType === 'text' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="script-text">Skript-Text</Label>
                      <Textarea
                        id="script-text"
                        placeholder="Geben Sie hier Ihr Skript ein..."
                        value={scriptText}
                        onChange={(e) => setScriptText(e.target.value)}
                        rows={5}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="script-audio">Audio für Skript hochladen</Label>
                      <Input id="script-audio" type="file" accept="audio/*" onChange={handleScriptAudioFileChange} />
                      {scriptAudioFile && <p className="text-sm text-muted-foreground">Ausgewählte Audiodatei: {scriptAudioFile.name}</p>}
                    </div>
                  )}

                  {scriptResult && (
                    <HighlightPanel className="mt-2">
                      <p className="text-sm font-medium">Skript verarbeitet:</p>
                      <p className="text-xs">Transkript: {scriptResult.transcript?.substring(0, 100)}...</p>
                      {scriptResult.subtitles && <p className="text-xs">Untertitel generiert.</p>}
                    </HighlightPanel>
                  )}
                  <Button onClick={handleProcessScript} disabled={isProcessingScript || (scriptInputType === 'text' && !scriptText.trim()) || (scriptInputType === 'audio' && !scriptAudioFile)}>
                    {isProcessingScript ? 'Wird verarbeitet...' : 'Skript verarbeiten'}
                  </Button>
                </StepSection>
              )}

              {/* Step 3: Voice */}
              {currentStep === 'voice' && (
                <StepSection>
                  <Label htmlFor="prebuilt-voice">Vordefinierte Stimme auswählen</Label>
                  <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                    <SelectTrigger id="prebuilt-voice">
                      <SelectValue placeholder="Wählen Sie eine Stimme" />
                    </SelectTrigger>
                    <SelectContent>
                      {prebuiltVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name} ({voice.gender}, {voice.language})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSelectVoice} disabled={!selectedVoiceId || isCloningVoice}>
                    Stimme auswählen
                  </Button>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-muted" />
                    <span className="flex-shrink mx-4 text-muted-foreground text-sm">ODER</span>
                    <div className="flex-grow border-t border-muted" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="clone-voice-audio">Eigene Stimme klonen (Audio hochladen)</Label>
                    <Input id="clone-voice-audio" type="file" accept="audio/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setClonedVoiceAudioFile(e.target.files[0]);
                    }} />
                    {clonedVoiceAudioFile && <p className="text-sm text-muted-foreground">Ausgewählte Audiodatei: {clonedVoiceAudioFile.name}</p>}
                    <Button
                      onClick={() => setIsVoiceCloningConsentOpen(true)}
                      disabled={!clonedVoiceAudioFile || isCloningVoice}
                      variant="secondary"
                    >
                      {isCloningVoice ? 'Wird geklont...' : 'Stimme klonen'}
                    </Button>
                  </div>

                  {voiceSpec && (
                    <HighlightPanel className="mt-2">
                      <p className="text-sm font-medium">Stimme ausgewählt:</p>
                      <p className="text-xs">ID: {voiceSpec.id}</p>
                      <p className="text-xs">Geklont: {voiceSpec.cloned ? 'Ja' : 'Nein'}</p>
                    </HighlightPanel>
                  )}
                  <VoiceCloningConsentDialog
                    isOpen={isVoiceCloningConsentOpen}
                    onClose={() => setIsVoiceCloningConsentOpen(false)}
                    onConsent={handleCloneVoiceConsent}
                    onCancel={() => {
                      setIsVoiceCloningConsentOpen(false);
                      setClonedVoiceAudioFile(null); // Clear file if consent cancelled
                      toast.info('Stimmenklonen abgebrochen.');
                    }}
                  />
                </StepSection>
              )}

              {/* Step 4: Style */}
              {currentStep === 'style' && (
                <StepSection>
                  <Label htmlFor="avatar-look">Avatar-Look auswählen</Label>
                  <Select value={selectedLook} onValueChange={(value: StyleSpec['look']) => setSelectedLook(value)}>
                    <SelectTrigger id="avatar-look">
                      <SelectValue placeholder="Wählen Sie einen Look" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label htmlFor="background-type">Hintergrund auswählen</Label>
                  <Select value={selectedBackground} onValueChange={(value: StyleSpec['background']) => setSelectedBackground(value)}>
                    <SelectTrigger id="background-type">
                      <SelectValue placeholder="Wählen Sie einen Hintergrund" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBackgrounds.map((bg) => (
                        <SelectItem key={bg.id} value={bg.id}>
                          {bg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedBackground === 'solid' && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="background-color">Hintergrundfarbe</Label>
                      <Input
                        id="background-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                      />
                    </div>
                  )}
                  {selectedBackground === 'image' && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="background-image">Hintergrundbild hochladen</Label>
                      <Input id="background-image" type="file" accept="image/*" onChange={(e) => {
                        // Handle background image upload (similar to asset upload)
                        if (e.target.files && e.target.files[0]) setBackgroundImageFile(e.target.files[0]);
                      }} />
                      {backgroundImageFile && <p className="text-sm text-muted-foreground">Ausgewählte Datei: {backgroundImageFile.name}</p>}
                    </div>
                  )}

                  {styleSpec && (
                    <HighlightPanel className="mt-2">
                      <p className="text-sm font-medium">Stil ausgewählt:</p>
                      <p className="text-xs">Look: {styleSpec.look}</p>
                      <p className="text-xs">Hintergrund: {styleSpec.background}</p>
                      {styleSpec.bgColor && <p className="text-xs">Farbe: {styleSpec.bgColor}</p>}
                    </HighlightPanel>
                  )}
                  <Button onClick={handleSelectStyle}>Stil auswählen</Button>
                </StepSection>
              )}

              {/* Step 5: Render */}
              {currentStep === 'render' && (
                <StepSection>
                  <OptionRow>
                    <Checkbox
                      id="watermark"
                      checked={watermark}
                      onCheckedChange={(checked) => setWatermark(!!checked)}
                    />
                    <Label htmlFor="watermark">
                      &quot;KI-generiert&quot;-Wasserzeichen hinzufügen
                    </Label>
                  </OptionRow>
                  <Button onClick={handleStartRender} disabled={isRendering || !uploadResult || !scriptResult || !voiceSpec || !styleSpec}>
                    {isRendering ? 'Wird gerendert...' : 'Rendering starten'}
                  </Button>

                  {isRendering && (
                    <div className="mt-4 flex flex-col gap-2">
                      <p className="text-sm font-medium">Rendering-Fortschritt:</p>
                      <Progress value={renderProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">{renderPhase}: {renderMessage} ({renderProgress.toFixed(0)}%)</p>
                    </div>
                  )}

                  {renderResult && (
                    <HighlightPanel className="mt-4">
                      <p className="text-sm font-medium">Rendering abgeschlossen:</p>
                      <p className="text-xs">Render-ID: {renderResult.renderId}</p>
                      <p className="text-xs">Vorschau-URL: <a href={renderResult.previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{renderResult.previewUrl}</a></p>
                      <p className="text-xs">Dauer: {renderResult.durationSec} Sekunden</p>
                      <video src={renderResult.previewUrl} controls className="mt-2 w-full max-h-64 object-contain bg-black" />
                    </HighlightPanel>
                  )}
                </StepSection>
              )}

              {/* Step 6: Export */}
              {currentStep === 'export' && (
                <StepSection>
                  <Label>Export-Optionen</Label>
                  <OptionRow>
                    <Checkbox
                      id="with-subtitles"
                      checked={exportOptions.withSubtitles}
                      onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, withSubtitles: !!checked }))}
                    />
                    <Label htmlFor="with-subtitles">
                      Untertitel exportieren (SRT/WebVTT)
                    </Label>
                  </OptionRow>
                  <OptionRow>
                    <Checkbox
                      id="also-png-sequence"
                      checked={exportOptions.alsoPngSequence}
                      onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, alsoPngSequence: !!checked }))}
                    />
                    <Label htmlFor="also-png-sequence">
                      Auch PNG-Bildsequenz exportieren
                    </Label>
                  </OptionRow>

                  <Button onClick={handleStartExport} disabled={isExporting || !renderResult}>
                    {isExporting ? 'Wird exportiert...' : 'Export starten'}
                  </Button>

                  {exportResult && (
                    <HighlightPanel className="mt-4">
                      <p className="text-sm font-medium">Export abgeschlossen:</p>
                      <p className="text-xs">Video-URL: <a href={exportResult.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{exportResult.videoUrl}</a></p>
                      {exportResult.subtitlesUrl && <p className="text-xs">Untertitel-URL: <a href={exportResult.subtitlesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{exportResult.subtitlesUrl}</a></p>}
                      {exportResult.pngSequenceUrl && <p className="text-xs">PNG-Sequenz-URL: <a href={exportResult.pngSequenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{exportResult.pngSequenceUrl}</a></p>}
                    </HighlightPanel>
                  )}
                </StepSection>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
}
