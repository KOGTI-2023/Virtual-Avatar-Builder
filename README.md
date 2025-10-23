# 🧠 Virtual Avatar Builder

The Virtual Avatar Builder is a multi-step Next.js application that helps you create talking avatars from your own assets. The workflow guides you from asset collection through script and voice design to rendering and export. All project and pipeline data is stored locally via a JSON database (`lowdb`) and dedicated media folders so the entire process runs without external services by default.

## 🚀 Key Features

- Guided six-step experience (Upload → Script → Voice → Style → Render → Export)
- Project management with automatic persistence for every step
- Support for text or audio scripts plus optional voice cloning with explicit consent tokens
- Style management with configurable looks, backgrounds, and watermarks
- Rendering and export endpoints for MP4 video, PNG image sequences, and subtitle tracks
- Privacy-first approach: all files stay on your machine unless you opt into external integrations

## 🗂️ Project Structure
```
.
├── src/app/page.tsx             # Multi-step avatar builder UI
├── src/app/api/*                # API routes for upload, script, voice, render, export, etc.
├── src/lib/database.ts          # lowdb initialization (JSON database at ./data/db.json)
├── public/uploads               # Uploaded assets
├── public/audio                 # Script and voice audio files
├── public/renders               # Intermediate render artifacts
├── public/exports               # Final exported files
└── docker-compose.yml           # Optional container orchestration
```

## 🧰 Requirements

- Git
- Node.js ≥ 18 (with npm or pnpm)
- Optional: Docker and Docker Compose for containerized deployments

## ⚡ Quick Start

Follow these steps to spin up the development environment.

### 🪄 Step 1 · Clone the repository
```bash
git clone https://github.com/KOGTI-2023/Virtual-Avatar-Builder.git
cd virtual-avatar-builder
```

### 📦 Step 2 · Install dependencies
```bash
pnpm install   # or: npm install
```

### 🖥️ Step 3 · Launch the development server
```bash
pnpm dev       # or: npm run dev
```

### 🌐 Step 4 · Open the application
Navigate to [http://localhost:3000](http://localhost:3000).

On the first run, `lowdb` creates `./data/db.json` automatically. Media directories inside `public/` already exist and are ready to use.

## ⚙️ Configuration

- **Database path**: Set `DATABASE_DIR` (e.g., in `.env` or your Docker environment) to change where `db.json` is stored. The default is `./data` in the project root.
- **External APIs**: Optional proxies to STT/TTS or other services are wired through environment variables consumed in `next.config.ts` (for example `EXTERNAL_STT_API_URL`). If no variable is set, the proxy remains disabled.
- **Voice cloning consent**: Voice cloning requires an explicit opt-in with a consent token handled by the `VoiceCloningConsentDialog`.

## 🔌 API & Upload Endpoints

API routes live under `src/app/api/` and can be exercised locally with tools such as `curl` or Postman:
- `POST /api/ingest/upload` – Upload assets (video or image)
- `POST /api/script/text` and `POST /api/script/audio` – Create or transcribe scripts
- `GET /api/voice/prebuilt` and `POST /api/voice/clone` – Manage voices
- `POST /api/style/apply` – Apply avatar styling
- `POST /api/render/start` – Kick off rendering with progress updates
- `POST /api/export/create` – Trigger exports (MP4, PNG sequence, subtitles)
- `GET/POST /api/projects` – Create, update, and retrieve projects

Each endpoint persists its status in the JSON database and writes files to the matching directories under `public/`.

## 🐳 Docker Compose

Use `docker-compose.yml` for a containerized setup. Before launching, adjust the referenced image to match your registry or build pipeline (for example, a local build or a custom GHCR image).

```bash
docker compose up -d
```

Named volumes keep the database and media assets persistent (`./data`, `./public/uploads`, `./public/audio`, `./public/renders`, `./public/exports`).

## 🧭 Additional Resources

- The builder relies on the shadcn/ui component kit (see `src/components/ui/*`).
- Type definitions for projects, scripts, voices, and more live in `src/types/avatar-builder.d.ts`.
- For production scenarios, harden the deployment with a reverse proxy, HTTPS, and tightened upload limits.

If you have questions or run into issues, explore the API route implementations and the React components driving each step. Contributions and feature ideas are welcome through issues or pull requests.
