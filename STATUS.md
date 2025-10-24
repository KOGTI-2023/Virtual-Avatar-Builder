# Projektstatus - Virtual Avatar Builder

## Ueberblick
- Next.js App-Router Anwendung fuer einen mehrstufigen Avatar-Builder mit lokaler LowDB-Datenbank.
- Dev-Start schlug wegen fehlender `localStorage`-Implementierung fehl; wurde durch serverseitigen Polyfill behoben.
- Landingpage besitzt nun ein schwarz-gelbes Branding sowie einen aktualisierten Footer-Hinweis.
- Docker-Setup erfordert noch Abgleich mit npm (Dockerfile nutzt weiterhin yarn).

## Tech-Stack
- Node.js 20 (lokal) / Dockerfile nutzt Node 20-alpine.
- Paketmanager: npm (`package-lock.json`, `.npmrc` mit `legacy-peer-deps`).
- Frameworks & Libraries: Next.js 15.5.6, React 19.1.0, TypeScript 5.x, TailwindCSS 3.4.x, LowDB 7, shadcn/ui.
- Tooling: ESLint (Flat-Config via `eslint-config-next`), PostCSS, Docker Compose.

## Build- & Run-Kommandos
- Abhaengigkeiten installieren: `npm install`
- Entwicklung starten: `npm run dev`
- Produktion bauen: `npm run build`
- Produktionsserver starten: `npm run start`
- Linting: `npm run lint`

## Abhaengigkeiten & Sicherheit
- `npm audit`: keine offenen Vulnerabilities (Stand: heute).
- Aktualisiert: Next.js 15.5.6 (schliesst Image-Cache-Schwachstellen).
- Offen (Major-Upgrades erforderlich, aktuell nicht durchgefuehrt): `@types/node` 24.x, `date-fns` 4.x, `lucide-react` 0.546.x, `recharts` 3.x, `tailwindcss` 4.x, `zod` 4.x.

## Dev-Status & Tests
- `npm run build`: erfolgreich (Next 15.5.6).
- `npm run lint`: erfolgreich, ESLint-Flat-Config hinterlegt.
- `npm run dev`: startet ohne 500-Fehler; Port-Auto-Auswahl bleibt bestehen.
- `.env.example` enthaelt deutsche Platzhaltertexte; keine Geheimnisse eingecheckt.

## Aufraeumarbeiten
- `Dockerfile.dyad` entfernt (keine Referenzen, Restbestand des Templates).
- `tsconfig.json` Pfade fuer vendorisiertes `react-day-picker` neu gesetzt, vendor-Quellcode von TypeScript-Typpruefung ausgenommen.
- Neues Skript `scripts/run-next-with-localstorage.cjs` sorgt fuer gueltigen `--localstorage-file` Pfad und entfernt alte Flags.
- README enthaelt weiterhin fehlerhafte Sonderzeichen; Korrektur noch offen.

## Risiken & To-dos
- Tailwind 4.x und weitere Major-Upgrades muessen separat getestet, ggf. in eigenem Branch umgesetzt werden.
- Dockerfile nutzt yarn-Workflows; Angleich an npm steht aus.
- README-Encoding ueberarbeiten, damit Darstellung plattformunabhaengig bleibt.
- Echte Integrationen fuer externe APIs fehlen; Mock-Endpunkte benoetigen spaetere Implementierung.
