# Virtual Avatar Builder

Der Virtual Avatar Builder ist eine mehrstufige Next.js-Anwendung, mit der sich sprechende Avatare auf Basis eigener Assets erstellen lassen. Der Workflow führt von der Asset-Erfassung über Skript- und Sprachgestaltung bis hin zu Rendering und Export. Sämtliche Projekt- und Pipeline-Daten werden lokal über eine JSON-Datenbank (`lowdb`) und dedizierte Medienverzeichnisse persistiert, sodass der gesamte Prozess ohne externe Dienste lauffähig bleibt.

## Hauptfunktionen

- Geführter Sechs-Schritte-Prozess (Upload → Skript → Stimme → Stil → Rendern → Exportieren)
- Projektverwaltung inklusive Zwischenspeicherung aller Eingaben
- Unterstützung für Text- oder Audio-Skripte sowie optionales Voice-Cloning mit Zustimmungstoken
- Stilverwaltung mit auswählbaren Looks, Hintergründen und Wasserzeichen
- Rendering- und Export-Endpunkte für Videoausgaben (MP4, PNG-Sequenz, Untertitel)
- Privacy-First-Ansatz: Alle Dateien verbleiben lokal, externe Services lassen sich nur per Opt-in aktivieren

## Verzeichnisstruktur
```
.
├── src/app/page.tsx             # Mehrstufiger Avatar-Builder im Frontend
├── src/app/api/*                # API-Routen für Upload, Skript, Voice, Render, Export usw.
├── src/lib/database.ts          # lowdb-Initialisierung (JSON-Datenbank unter ./data/db.json)
├── public/uploads               # Hochgeladene Assets
├── public/audio                 # Audio-Dateien (Skript, Stimme)
├── public/renders               # Zwischenergebnisse des Renderings
├── public/exports               # Exportierte Dateien
└── docker-compose.yml           # Optionale Container-Orchestrierung
```

## Voraussetzungen

- Git
- Node.js ≥ 18 (inkl. npm oder pnpm)
- Optional: Docker und Docker Compose für containerisierte Ausführung

## Schnellstart (lokale Entwicklung)

1. Repository klonen und in das Projektverzeichnis wechseln:
   ```bash
   git clone https://github.com/your-username/virtual-avatar-builder.git
   cd virtual-avatar-builder
   ```
2. Abhängigkeiten installieren:
   ```bash
   pnpm install   # alternativ: npm install
   ```
3. Entwicklungsserver starten:
   ```bash
   pnpm dev       # alternativ: npm run dev
   ```
4. Anwendung aufrufen: [http://localhost:3000](http://localhost:3000)

Beim ersten Start erzeugt `lowdb` automatisch `./data/db.json`. Die Medienverzeichnisse in `public/` existieren bereits und können direkt genutzt werden.

## Konfiguration

- **Datenbankpfad**: Über `DATABASE_DIR` (z.B. `.env` oder Docker-Umgebung) lässt sich der Speicherort der `db.json` steuern. Standard ist `./data` im Projektstamm.
- **Externe APIs**: Optionale Weiterleitungen zu STT-/TTS- oder anderen Diensten werden über die Umgebungsvariablen konfiguriert, die in `next.config.ts` abgefragt werden (z.B. `EXTERNAL_STT_API_URL`). Ohne gesetzte Variable bleibt die Proxy-Regel deaktiviert.
- **Voice-Cloning-Zustimmung**: Für Voice-Cloning wird ein ausdrückliches Opt-in inklusive Zustimmungstoken eingefordert (`VoiceCloningConsentDialog`).

## REST- und Upload-Endpunkte

Die API-Routen befinden sich unter `src/app/api/` und lassen sich lokal mit Tools wie `curl` oder Postman testen:
- `POST /api/ingest/upload` – Assets hochladen (z.B. Video oder Bild)
- `POST /api/script/from-text` bzw. `POST /api/script/from-audio` – Skript anlegen oder transkribieren
- `GET /api/voice/prebuilt` und `POST /api/voice/clone` – Stimmenverwaltung
- `POST /api/style/apply` – Avatar-Stil setzen
- `POST /api/render/start` – Renderprozess starten, liefert Fortschritts-Updates
- `POST /api/export/create` – Exporte anstoßen (MP4, PNG-Sequenz, Untertitel)
- `GET/POST /api/projects` – Projekte anlegen, aktualisieren und abrufen

Jeder Endpunkt persistiert seinen Status in der JSON-Datenbank und legt Dateien in den entsprechenden Verzeichnissen unter `public/` ab.

## Betrieb mit Docker Compose
Für eine containerisierte Ausführung kann `docker-compose.yml` genutzt werden. Vor dem Start muss das im Compose-File referenzierte Image an das eigene Registry- oder Build-Setup angepasst werden (z.B. lokale Builds oder ein eigenes GHCR-Image).

```bash
docker compose up -d
```

Die definierten Volumes sorgen dafür, dass Datenbank und Medien persistent bleiben (`./data`, `./public/uploads`, `./public/audio`, `./public/renders`, `./public/exports`).

## Weiterführende Hinweise

- Der Avatar Builder setzt auf das shadcn/ui-Komponentenkit (siehe `src/components/ui/*`).
- Typdefinitionen für Projekte, Skripte, Stimmen usw. liegen in `src/types/avatar-builder.d.ts`.
- Für produktive Szenarien empfiehlt sich ein Härtungskonzept (Reverse Proxy, HTTPS, abgesicherte Upload-Größen etc.).

Bei Fragen oder Problemen hilft ein Blick in die Quelltexte der API-Routen sowie in die React-Komponenten des Builders. Issues und Feature-Wünsche können direkt im Repository diskutiert werden.
