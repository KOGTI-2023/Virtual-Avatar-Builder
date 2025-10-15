# Testplan für den Virtuellen Avatar-Ersteller

Dieser Testplan beschreibt die Akzeptanztests und Randfälle für den Virtuellen Avatar-Ersteller, um sicherzustellen, dass die Anwendung die definierten Anforderungen erfüllt und eine robuste, fehlerfreie Benutzererfahrung bietet.

## 1. Akzeptanztests (Happy Path)

Ziel: Sicherstellen, dass der Benutzer den gesamten Workflow ohne Fehler abschließen kann.

**Testfall 1.1: Vollständiger Workflow mit Bild-Upload und Text-Skript**
1.  **Projekt erstellen**: Navigieren Sie zur Startseite und geben Sie einen Projektnamen ein (z.B. "Mein erster Avatar"). Klicken Sie auf "Projekt erstellen".
2.  **Asset hochladen (Bild)**:
    *   Wählen Sie ein Gesichtsbild aus (z.B. `face.jpg`).
    *   Klicken Sie auf "Hochladen & Prüfen".
    *   **Erwartet**: Erfolgsmeldung "Asset erfolgreich hochgeladen und Qualitätsprüfung durchgeführt.", Qualitätsdetails werden angezeigt, und der Schritt wechselt zu "Skript eingeben".
3.  **Skript eingeben (Text)**:
    *   Wählen Sie "Text eingeben".
    *   Geben Sie einen Skripttext ein (z.B. "Hallo, ich bin Ihr neuer virtueller Avatar.").
    *   Klicken Sie auf "Skript verarbeiten".
    *   **Erwartet**: Erfolgsmeldung "Skript erfolgreich verarbeitet.", Skriptdetails werden angezeigt, und der Schritt wechselt zu "Stimme auswählen".
4.  **Stimme auswählen (Vordefiniert)**:
    *   Wählen Sie eine vordefinierte Stimme aus der Dropdown-Liste (z.B. "Standard Male").
    *   Klicken Sie auf "Stimme auswählen".
    *   **Erwartet**: Erfolgsmeldung "Stimme ausgewählt.", Stimmdetails werden angezeigt, und der Schritt wechselt zu "Visuellen Stil wählen".
5.  **Visuellen Stil wählen**:
    *   Wählen Sie einen Avatar-Look (z.B. "Fotorealistisch").
    *   Wählen Sie einen Hintergrund (z.B. "Einfarbig").
    *   Wählen Sie eine Hintergrundfarbe (z.B. Blau).
    *   Klicken Sie auf "Stil auswählen".
    *   **Erwartet**: Erfolgsmeldung "Stil ausgewählt.", Stildetails werden angezeigt, und der Schritt wechselt zu "Avatar rendern".
6.  **Avatar rendern**:
    *   Aktivieren Sie optional das Kontrollkästchen "KI-generiert"-Wasserzeichen hinzufügen.
    *   Klicken Sie auf "Rendering starten".
    *   **Erwartet**: Fortschrittsanzeige wird aktualisiert, Erfolgsmeldung "Rendering erfolgreich gestartet." und "Rendering abgeschlossen!", Render-Ergebnis mit Vorschau-URL und Video-Player wird angezeigt, und der Schritt wechselt zu "Exportieren".
7.  **Exportieren**:
    *   Aktivieren Sie optional "Untertitel exportieren" und "Auch PNG-Bildsequenz exportieren".
    *   Klicken Sie auf "Export starten".
    *   **Erwartet**: Erfolgsmeldung "Export erfolgreich abgeschlossen.", Export-Ergebnis mit Video-URL (und optional Untertitel-/PNG-Sequenz-URLs) wird angezeigt.

**Testfall 1.2: Vollständiger Workflow mit Video-Upload und Audio-Skript**
1.  **Projekt erstellen**: Erstellen Sie ein neues Projekt.
2.  **Asset hochladen (Video)**:
    *   Wählen Sie ein kurzes Referenzvideo aus (3-10s, z.B. `reference.mp4`).
    *   Klicken Sie auf "Hochladen & Prüfen".
    *   **Erwartet**: Erfolgsmeldung, Qualitätsdetails, Schritt wechselt.
3.  **Skript eingeben (Audio)**:
    *   Wählen Sie "Audio aufnehmen/hochladen".
    *   Laden Sie eine Audiodatei hoch (z.B. `script_audio.mp3`).
    *   Klicken Sie auf "Skript verarbeiten".
    *   **Erwartet**: Erfolgsmeldung, Skriptdetails (Transkript, Untertitel), Schritt wechselt.
4.  **Stimme auswählen (Klonen)**:
    *   Laden Sie eine Audiodatei für das Klonen der Stimme hoch (z.B. `my_voice.mp3`).
    *   Klicken Sie auf "Stimme klonen".
    *   **Erwartet**: Zustimmungsdialog erscheint.
    *   **Zustimmungsdialog**: Aktivieren Sie "Ich habe die Bedingungen gelesen und stimme ihnen zu." und geben Sie einen Token ein (z.B. "MeinToken"). Klicken Sie auf "Zustimmen und Stimme klonen".
    *   **Erwartet**: Erfolgsmeldung "Stimme erfolgreich geklont.", Stimmdetails, Schritt wechselt.
5.  **Visuellen Stil wählen**: Wählen Sie "Cartoon" und "Transparenten" Hintergrund. Klicken Sie auf "Stil auswählen".
    *   **Erwartet**: Erfolgsmeldung, Stildetails, Schritt wechselt.
6.  **Avatar rendern**: Klicken Sie auf "Rendering starten".
    *   **Erwartet**: Fortschrittsanzeige, Erfolgsmeldungen, Render-Ergebnis, Schritt wechselt.
7.  **Exportieren**: Aktivieren Sie alle Exportoptionen. Klicken Sie auf "Export starten".
    *   **Erwartet**: Erfolgsmeldung, Export-Ergebnis mit allen URLs.

## 2. Randfälle und Fehlerbehandlung

Ziel: Sicherstellen, dass die Anwendung robust auf ungültige Eingaben, fehlende Daten und Benutzerabbrüche reagiert.

**Testfall 2.1: Fehlende Eingaben**
*   **Projektname**: Versuchen Sie, ein Projekt mit leerem Namen zu erstellen.
    *   **Erwartet**: Fehlermeldung "Bitte geben Sie einen Projektnamen ein."
*   **Asset-Upload**: Versuchen Sie, ohne Datei hochzuladen.
    *   **Erwartet**: Fehlermeldung "Bitte wählen Sie eine Datei zum Hochladen aus."
*   **Skript-Text**: Versuchen Sie, ein Text-Skript mit leerem Text zu verarbeiten.
    *   **Erwartet**: Fehlermeldung "Bitte geben Sie Text für das Skript ein."
*   **Skript-Audio**: Versuchen Sie, ein Audio-Skript ohne Audiodatei zu verarbeiten.
    *   **Erwartet**: Fehlermeldung "Bitte wählen Sie eine Audiodatei für das Skript aus."
*   **Stimme auswählen**: Versuchen Sie, eine Stimme auszuwählen, ohne eine vordefinierte Stimme gewählt zu haben.
    *   **Erwartet**: Fehlermeldung "Bitte wählen Sie eine Stimme aus."
*   **Stil auswählen**: Versuchen Sie, einen Stil auszuwählen, ohne Look oder Hintergrund gewählt zu haben.
    *   **Erwartet**: Fehlermeldung "Bitte wählen Sie einen Look und einen Hintergrund aus."
*   **Rendering ohne vorherige Schritte**: Versuchen Sie, das Rendering zu starten, bevor alle vorherigen Schritte abgeschlossen sind.
    *   **Erwartet**: Fehlermeldung "Bitte schließen Sie alle vorherigen Schritte ab, bevor Sie rendern."
*   **Export ohne Rendering**: Versuchen Sie, den Export zu starten, bevor das Rendering abgeschlossen ist.
    *   **Erwartet**: Fehlermeldung "Bitte rendern Sie zuerst den Avatar."

**Testfall 2.2: Qualitätsprüfung schlägt fehl**
*   **Asset-Upload**: Laden Sie ein Bild hoch, auf dem kein Gesicht zu sehen ist oder das sehr unscharf ist (simulieren Sie dies, indem Sie die `QualityService` so anpassen, dass `faceDetected` `false` ist).
    *   **Erwartet**: Upload-Erfolgsmeldung, aber Qualitätsdetails zeigen "Gesicht erkannt: Nein" und entsprechende Hinweise. Der Workflow sollte fortgesetzt werden können, aber der Benutzer wird auf das Qualitätsproblem hingewiesen.

**Testfall 2.3: Stimmenklonen - Zustimmungsfehler**
*   **Zustimmungsdialog abbrechen**: Öffnen Sie den Stimmenklon-Zustimmungsdialog und klicken Sie auf "Abbrechen".
    *   **Erwartet**: Dialog schließt sich, keine Stimme geklont, Info-Toast "Stimmenklonen abgebrochen.".
*   **Zustimmung ohne Bedingungen**: Versuchen Sie, im Dialog zuzustimmen, ohne die Bedingungen zu akzeptieren.
    *   **Erwartet**: Schaltfläche "Zustimmen und Stimme klonen" ist deaktiviert.
*   **Zustimmung ohne Token**: Versuchen Sie, im Dialog zuzustimmen, ohne einen Token einzugeben.
    *   **Erwartet**: Schaltfläche "Zustimmen und Stimme klonen" ist deaktiviert.
*   **Klonen einer Prominentenstimme**: Versuchen Sie, eine Audiodatei mit dem Namen "celebrity.mp3" hochzuladen und zu klonen (simuliert durch `VoiceService`).
    *   **Erwartet**: Fehlermeldung "Celebrity voice cloning is not allowed." (oder die deutsche Übersetzung, wenn implementiert).

**Testfall 2.4: Projektverwaltung**
*   **Projekt aktualisieren**: Erstellen Sie ein Projekt, laden Sie ein Asset hoch und navigieren Sie zurück zur Projektübersicht. Öffnen Sie das Projekt erneut.
    *   **Erwartet**: Das Projekt sollte mit dem hochgeladenen Asset geladen werden, und der Workflow sollte an der richtigen Stelle fortgesetzt werden.
*   **Projekt löschen**: Implementieren Sie eine Möglichkeit, Projekte zu löschen (z.B. über eine Projektliste). Löschen Sie ein Projekt.
    *   **Erwartet**: Projekt wird aus der Liste entfernt.

**Testfall 2.5: UI-Reaktionsfähigkeit**
*   **Ladezustände**: Überprüfen Sie, ob die Schaltflächen während des Hochladens, Verarbeitens, Renderns und Exportierens korrekt deaktiviert sind und Ladeindikatoren (z.B. "Wird hochgeladen...") angezeigt werden.
    *   **Erwartet**: UI reagiert korrekt auf Ladezustände.
*   **Abbrechen-Funktion**: (Nicht explizit im UI implementiert, aber in den Prinzipien erwähnt) Wenn eine Abbrechen-Funktion hinzugefügt wird, testen Sie, ob sie den aktuellen Vorgang sicher beendet und den Zustand zurücksetzt.

## 3. Datenschutz- und Sicherheitsprüfungen

Ziel: Sicherstellen, dass die Anwendung die Datenschutz- und Sicherheitsprinzipien einhält.

*   **Lokale Speicherung**: Überprüfen Sie, ob hochgeladene Dateien (Assets, Audio) und generierte Ausgaben (Renderings, Exporte) im `public/uploads`, `public/audio`, `public/renders` und `public/exports` Verzeichnis des Projekts gespeichert werden und nicht an externe Dienste gesendet werden, es sei denn, dies ist explizit konfiguriert und zugestimmt.
*   **Zustimmung zum Stimmenklonen**: Stellen Sie sicher, dass der Stimmenklon-Zustimmungsdialog vor jedem Klonversuch angezeigt wird und dass die Zustimmung (Token) erfasst wird.
*   **Kein Klonen von Prominentenstimmen**: Testen Sie die Blockierung von Prominentenstimmen (durch Mocking).
*   **Wasserzeichen**: Überprüfen Sie, ob das "KI-generiert"-Wasserzeichen im gerenderten Video erscheint, wenn die Option aktiviert ist (durch Mocking der Render-Ausgabe).
*   **Umgebungsvariablen**: Stellen Sie sicher, dass externe API-URLs nur über Umgebungsvariablen konfiguriert werden und dass die Anwendung ohne diese Variablen lokal funktioniert.

## 4. Performance-Prüfungen (Manuell/Beobachtung)

Ziel: Sicherstellen, dass die Anwendung eine reibungslose Benutzererfahrung bietet.

*   **UI-Reaktionsfähigkeit**: Beobachten Sie die UI während der Interaktion. Gibt es Verzögerungen oder Ruckler?
*   **Vorschau-Wiedergabe**: Spielen Sie das gerenderte Vorschau-Video ab. Ist die Wiedergabe flüssig?
*   **Speichernutzung**: Überwachen Sie die Speichernutzung des Browsers und des Node.js-Prozesses bei der Verarbeitung größerer Dateien oder längerer Skripte. Bleibt sie stabil?
*   **Rendering-Zeiten**: Beachten Sie die simulierten Rendering-Zeiten. Sind sie realistisch für die Komplexität der Aufgabe?