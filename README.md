# AI Resume Generator

> **[中文文档 / Chinese Documentation](./README.zh-CN.md)**

A static, client-side resume builder with AI-powered document import. No backend needed — runs entirely in the browser, deployable to GitHub Pages.

## Features

- **Document Import** — Upload PDF, Word, Markdown, TXT, CSV, or JSON files
- **AI Extraction** — Ollama (local) or OpenAI-compatible API to intelligently parse resume content
- **Rule-based Extraction** — Regex-based fallback that works offline, no API needed
- **3 Templates** — Classic (single-column serif), Modern (two-column with sidebar), Minimal (clean whitespace)
- **Live Preview** — Real-time A4 preview with dynamic spacing based on content density
- **Section Reordering** — Drag sections to rearrange the resume layout
- **AI Summary Generation** — Auto-generate a professional summary from your resume content
- **i18n** — Chinese / English bilingual UI and resume content
- **PDF Export** — Browser-native print-to-PDF with full CSS support
- **Data Persistence** — Auto-saves to localStorage, supports JSON export/import

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Zustand (state management + localStorage persistence)
- react-i18next (internationalization)
- pdfjs-dist / mammoth / marked / papaparse (document parsing)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173/resume_generate/

## AI Configuration

### Ollama (Local, Free)

1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull llama3:8b` (or `qwen2.5:7b` for better Chinese support)
3. In the app, click **Import** → select **AI mode** → choose **Ollama (Local)**

### OpenAI / Compatible API

1. In the app, click **Import** → select **AI mode** → choose **OpenAI / Compatible**
2. Enter your API base URL, key, and model name

## Build & Deploy

```bash
npm run build
```

Deploy the `dist/` folder to GitHub Pages. A GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

## License

[CC BY-NC 4.0](./LICENSE) — Free to use and modify, **not for commercial use**.
