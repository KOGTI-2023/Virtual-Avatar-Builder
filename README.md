# Virtual Avatar Builder

Der Virtual Avatar Builder ist eine mehrstufige Next.js-Anwendung, die das Erstellen sprechender Avatare aus eigenen Assets ermöglicht. Der Assistent führt von Upload, Skript und Stimme über Stil und Rendering bis zum Export. Alle Daten werden lokal in einer JSON-Datenbank (LowDB) sowie in dedizierten Medienordnern gespeichert. Damit bleibt der gesamte Prozess standardmäßig offline fähig.

## Funktionsumfang
- Geführter Sechs-Schritte-Flow (Upload -> Script -> Voice -> Style -> Render -> Export)
- Projektverwaltung mit automatischer Zwischenspeicherung nach jedem Arbeitsschritt
- Unterstützung für Text- oder Audio-Skripte sowie optionales Voice Cloning mit Consent-Token
- Anpassbare Styles, Hintergründe und Wasserzeichen
- Rendering- und Export-Endpunkte für MP4, PNG-Sequenzen und Untertitel
- Datenschutzfreundlich: Alle Dateien verbleiben lokal, externe Integrationen sind optional

## Projektstruktur
```text
.
├─ src/app/page.tsx            # Mehrstufiges UI für den Avatar-Builder
├─ src/app/api/*               # API-Routen für Upload, Script, Voice, Render, Export usw.
├─ src/lib/database.ts         # LowDB-Initialisierung (JSON-Datenbank unter ./data/db.json)
├─ public/uploads              # Hochgeladene Assets
├─ public/audio                # Skript- und Voice-Audio
├─ public/renders              # Zwischenprodukte aus dem Rendering
├─ public/exports              # Finale Exportdateien
├─ docker-compose.yml          # Optionales Container-Setup
└─ Dockerfile                  # Produktions-Build für Next.js
```

## Voraussetzungen
- Git
- Node.js >= 18.18 (empfohlen: 20) mit npm
- Optional: Docker und Docker Compose für containerisierte Umgebungen

## Schnellstart
1. Repository klonen  
   ```bash
   git clone https://github.com/KOGTI-2023/Virtual-Avatar-Builder.git
   cd Virtual-Avatar-Builder
   ```
2. Abhängigkeiten installieren  
   ```bash
   npm install
   ```
3. Entwicklungsserver starten  
   ```bash
   npm run dev
   ```
4. Anwendung im Browser öffnen: <http://localhost:3000>

Beim ersten Start legt LowDB automatisch `./data/db.json` an. Die Medienordner unter `public/` sind bereits vorbereitet.

## Konfiguration
- **DATABASE_DIR**: Pfad zur LowDB-Datenbank (Standard: `./data`). Kann per Umgebungsvariable angepasst werden.
- **EXTERNAL_API_URL_SERVICE1 / SERVICE2**: Optionale Proxy-Ziele für externe Backends, die über Next.js-Rewrites erreichbar sein sollen.
- **WEATHER_API_URL**: Beispiel für einen zusätzlichen Proxy-Endpunkt (z. B. Wetterdaten).
- **EXTERNAL_STT_API_URL**: Proxy-Ziel für eine Speech-to-Text-Integration.

Siehe `.env.example` für kommentierte Platzhalterwerte.

## API-Routen
Alle APIs liegen unter `src/app/api/` und lassen sich lokal mit Tools wie cURL oder Postman testen.

- `POST /api/ingest/upload` – Asset-Upload (Bild oder Video)
- `POST /api/script/text` / `POST /api/script/audio` – Skripterstellung bzw. Transkription
- `GET /api/voice/prebuilt` / `POST /api/voice/clone` – Verwaltung von Stimmen
- `GET /api/style/available` – Verfügbare Avatar-Stile
- `POST /api/render/start` – Rendering mit Fortschrittsupdates
- `GET /api/render/progress/:id` – Fortschritt eines Renderjobs
- `POST /api/export/start` – Export (MP4, optional PNG-Sequenz oder Untertitel)
- `GET /api/projects` / `POST /api/projects` – Projekte lesen oder anlegen
- `PUT /api/projects/:id` / `DELETE /api/projects/:id` – Projekte aktualisieren bzw. löschen

Jeder Endpunkt aktualisiert die JSON-Datenbank und schreibt Dateien in die passenden Unterordner von `public/`.

## Docker Compose
`docker-compose.yml` liefert ein Beispiel-Setup für eine containerisierte Bereitstellung. Vor dem Start sollte das Image-Tag angepasst oder ein eigenes Image gebaut werden. Persistente Daten (Datenbank, Uploads, Audio, Renders, Exports) sind als Volumes eingetragen.

```bash
docker compose up -d
```

## Weiteres
- Die Anwendung nutzt shadcn/ui-Komponenten (siehe `src/components/ui`).
- Projektspezifische Typdefinitionen befinden sich in `src/types/avatar-builder.d.ts`.
- Für produktive Szenarien sollten Reverse-Proxy, HTTPS und Upload-Limits ergänzt werden.

Feedback und Erweiterungen sind willkommen – gern Issues oder Pull Requests eröffnen.
