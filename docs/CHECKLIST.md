# ✅ Development Checklist – Virtual Avatar Builder
_Last updated: 2025-10-23_

---

## 🧩 Kernaufgaben
| Aufgabe | Beschreibung | Status |
|---------|---------------|--------|
| Refactor LowDB initialization | Persistente Defaults und Fehlerhandling | ✅ |
| Projekt-API härten | Route-Signaturen und Fehlerbehandlung aktualisieren | ✅ |
| Kalender auf React 19 heben | `react-day-picker` vendorisiert und getestet | ✅ |
| ESLint-Setup abschließen | Paket installieren & CI-Lint reaktivieren | 🟠 |
| Formvalidierung mit React Hook Form verbessern | Client-Formulare absichern | ⬜ |
| Voice-Synthese anbinden | Schnittstelle zu TTS-Diensten | ⬜ |
| Avatar-Preview performanceoptimieren | Rendering-Profiling & Memoization | ⬜ |
| Tests für Export-/Importflüsse ergänzen | Regressionen verhindern | ⬜ |

---

## ⚙️ Technische Qualitätschecks
| Check | Status | Notizen |
|-------|--------|---------|
| Build läuft fehlerfrei | 🟡 | Fonts von Google blockieren Offline-Builds |
| ESLint-Pipeline | ❌ | Paket fehlt, Builds skippen Lint |
| Lokaler Vendor-Sync für Kernabhängigkeiten | 🟢 | `react-day-picker` 9.0.0 lokal gespiegelt |
| TypeScript-Strictness | ✅ | Server-Routen sind typsicher |
| API-Keys via `.env` | ✅ | Keine sensiblen Keys im Repo |
| CI-Workflows | 🟡 | Läuft, aber Lint-Job derzeit wirkungslos |

---

## 📦 Release Readiness
| Aspekt | Status | Hinweise |
|--------|--------|----------|
| Dokumentation | 🟡 | Entwickler-Doku aktualisiert, User-Doku offen |
| Testabdeckung | 🟠 | Kernpfade ungetestet |
| UI-Polish | 🟢 | Funktionsfähig, Feinschliff möglich |
| Performance | 🟡 | Avatar-Rendering prüfen |
| Sicherheit | ⬜ | Keine dedizierte Prüfung erfolgt |

---

## 🧾 Hinweise für Codex
- Sobald Registry-Zugriff wieder möglich ist, `pnpm install --save-dev eslint` ausführen und `next.config.ts`-Bypass entfernen.
- Font-Fetch-Fehler in Offline-Umgebungen durch lokale Bundles oder Self-Hosting lösen.
