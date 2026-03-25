<p align="center">
  <img src="src-tauri/icons/128x128.png" alt="GitHub AI Explorer" width="80" />
</p>

<h1 align="center">GitHub AI Explorer</h1>

<p align="center">
  <strong>Search GitHub repositories, code, and issues using AI-powered natural language -- right from your desktop.</strong>
</p>

<p align="center">
  <a href="https://github.com/sodam-ai/github-ai-explorer/releases">
    <img src="https://img.shields.io/badge/version-0.3.0-blue.svg" alt="Version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/platform-Windows-0078D6.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/Tauri-2.0-FFC131.svg" alt="Tauri" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/installer-4.7MB-purple.svg" alt="Size" />
</p>

<p align="center">
  <a href="README.ko.md">한국어</a> &middot;
  <a href="README.ja.md">日本語</a> &middot;
  <a href="README.zh.md">中文</a>
</p>

---

## What is GitHub AI Explorer?

**GitHub AI Explorer** is a lightweight desktop application that lets you search and explore GitHub using plain, everyday language instead of complex search syntax.

Instead of typing `react drag drop library stars:>1000 language:typescript`, just type:

> "React drag and drop library with lots of stars and TypeScript support"

The AI understands what you mean and finds the best matching repositories, code, and issues -- then summarizes the results so you can decide quickly.

### Who is this for?

- **Developers** looking for libraries, tools, or code examples
- **Students** exploring open-source projects for learning
- **Researchers** discovering relevant repositories in their field
- **Anyone** curious about what exists on GitHub

---

## Feature Overview (50+)

### Search & Discovery

| # | Feature | Description |
|---|---------|-------------|
| 1 | AI Semantic Search | 3-stage parallel search: general + user repositories + `user:` query for comprehensive results |
| 2 | Search Result AI Summary | AI generates a concise summary at the top of every search |
| 3 | Natural Language Code Q&A | Ask questions about any repo's code -- AI answers using RAG (README + file tree context) |
| 4 | Code Snippet Viewer | Syntax-highlighted code viewer supporting 12+ languages via Prism.js |
| 5 | Advanced Filters (8 types) | Author, language, license, stars, forks, date range, sort order, archive status |
| 6 | Filter Presets | 3 built-in quick presets + visual filter chip display |
| 7 | Search Autocomplete | Suggestions from your search history and popular GitHub topics |
| 8 | Empty Query Filter Search | Search using only filters -- no search text required |
| 9 | Infinite Scroll | Results load automatically as you scroll down |

### Analysis & Comparison

| # | Feature | Description |
|---|---------|-------------|
| 10 | Repository Comparison | Side-by-side comparison table for 2-3 similar repositories |
| 11 | Health Score Analysis | Score + letter grade (A-F) based on activity, documentation, and community |
| 12 | Comparison History | Save past comparisons and revisit them anytime |
| 13 | AI Model Benchmark | Test and compare response quality across different AI providers |

### Organization & Management

| # | Feature | Description |
|---|---------|-------------|
| 14 | Bookmarks & Collections | Save repos with personal notes, organize into named collections |
| 15 | Smart Folders | Auto-classify repos into collections based on custom rules |
| 16 | Code Snippet Storage | Save interesting code snippets in a persistent drawer UI |
| 17 | Collection Export | Export collections as JSON for backup or sharing |
| 18 | Search History | Every search is permanently saved in local SQLite |
| 19 | Repository Preview | Modal with README, stats, topics, and language breakdown |

### Dashboard & Monitoring

| # | Feature | Description |
|---|---------|-------------|
| 20 | Trending Dashboard | Discover trending repos: today / this week / this month |
| 21 | Usage Statistics | Visualize search patterns, top keywords, and activity graph |
| 22 | Repository Alerts | Subscribe to repo changes and receive notifications |

### User Experience

| # | Feature | Description |
|---|---------|-------------|
| 23 | Dark / Light Mode | Toggle themes + 6 custom accent colors |
| 24 | Keyboard Shortcuts | Full keyboard navigation with command palette (`Ctrl+K`) |
| 25 | Onboarding Guide | 3-step interactive tutorial for first-time users |
| 26 | System Tray | Minimize to tray, always accessible with a double-click |
| 27 | Auto Update | Automatic updates via GitHub Releases + Tauri updater |
| 28 | Accessibility | ARIA labels, keyboard navigation, screen reader support |
| 29 | Offline Mode | Browse cached data and search without internet |
| 30 | Ollama Local AI | Run AI completely offline with local models (no API key needed) |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open Command Palette (quick search from anywhere) |
| `Ctrl + F` | Focus search bar |
| `Ctrl + ,` | Open Settings |
| `Ctrl + B` | Toggle bookmark for selected repository |
| `j` / `k` | Navigate search results (down / up) |
| `Enter` | Open / preview selected repository |
| `Escape` | Close current modal or panel |

---

## Installation

### Option 1: Download Installer (Recommended)

The easiest way to get started -- no programming knowledge required.

1. Go to the [Releases](https://github.com/sodam-ai/github-ai-explorer/releases) page
2. Download the latest version:

| File | Size | Description |
|------|------|-------------|
| `GitHub AI Explorer_x64_en-US.msi` | 4.7 MB | Standard Windows installer (recommended). Includes uninstall support via Control Panel. |
| `GitHub AI Explorer_x64-setup.exe` | 3.3 MB | NSIS portable installer. |

3. Run the downloaded file and follow the on-screen instructions
4. Launch **GitHub AI Explorer** from the Start menu or desktop shortcut

> **Note:** Windows may show a SmartScreen warning for unsigned apps. Click "More info" then "Run anyway" to proceed.

### Option 2: Build from Source

For developers who want to modify or contribute to the project.

#### Prerequisites

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| Node.js | 18+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| Rust | 1.77+ | Backend compilation | [rustup.rs](https://rustup.rs/) |
| Visual Studio Build Tools | 2022 | C++ compiler (Windows) | [visualstudio.microsoft.com](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| Git | Latest | Source code management | [git-scm.com](https://git-scm.com/) |

#### Step-by-Step Build

```bash
# 1. Clone the repository
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer

# 2. Install frontend dependencies
npm install

# 3. Run in development mode
#    First run takes 5-10 minutes (Rust compilation). Subsequent runs start in seconds.
#    Opens at http://127.0.0.1:7719
npm run tauri:dev

# 4. Build production installer (.msi + .exe)
npm run tauri:build
```

After building, installers are located at:

```
src-tauri/target/release/bundle/msi/GitHub AI Explorer_0.3.0_x64_en-US.msi
src-tauri/target/release/bundle/nsis/GitHub AI Explorer_0.3.0_x64-setup.exe
```

---

## Getting Started

### Step 1: Choose an AI Provider

On first launch, the onboarding guide walks you through setup. Open **Settings** (`Ctrl + ,`) and configure at least one AI provider:

| Provider | Get API Key | Models | Free Tier |
|----------|-------------|--------|-----------|
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) | GPT-4o, GPT-4o-mini | No |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | Claude 4, Claude 4 Sonnet | No |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/apikey) | Gemini 2.5 Pro, Gemini 2.5 Flash | Yes |
| Groq | [console.groq.com](https://console.groq.com/keys) | LLaMA, Mixtral | Yes |
| Ollama | [ollama.com](https://ollama.com/) | LLaMA, Mistral, Phi, etc. | Yes (local, no key needed) |

### Step 2: Add a GitHub Token (Optional but Recommended)

A GitHub personal access token increases your API rate limit from **60 to 5,000 requests per hour**.

1. Visit [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Select the `public_repo` scope
4. Copy the token and paste it in **Settings > GitHub Token**

### Step 3: Start Searching

Type a natural language query in the search bar and press Enter:

- "React state management library with TypeScript support"
- "Python machine learning projects for beginners"
- "Rust web framework with good performance benchmarks"
- "Open source calendar component with drag and drop"

Use the **Advanced Filters** panel to narrow results by language, stars, license, and more.

---

## Supported AI Providers

| Provider | Models | Offline | Free Tier | Best For |
|----------|--------|---------|-----------|----------|
| OpenAI | GPT-4o, GPT-4o-mini | No | No | Highest quality responses |
| Anthropic | Claude 4, Claude 4 Sonnet | No | No | Detailed code analysis |
| Google Gemini | Gemini 2.5 Pro, Flash | No | Yes | Free usage with good quality |
| Groq | LLaMA, Mixtral | No | Yes | Fastest response times |
| Ollama | LLaMA, Mistral, Phi, etc. | **Yes** | **Yes** | Privacy-first, fully offline |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Desktop Framework | [Tauri](https://tauri.app/) | 2.0 |
| Frontend | [React](https://react.dev/) | 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) | 5.9 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4.2 |
| Backend | [Rust](https://www.rust-lang.org/) | 1.77+ |
| Database | [SQLite](https://www.sqlite.org/) via rusqlite | 0.32 |
| State Management | [Zustand](https://zustand.docs.pmnd.rs/) | 5.0 |
| Animation | [Framer Motion](https://www.framer.com/motion/) | 12 |
| Syntax Highlighting | [Prism.js](https://prismjs.com/) | 1.30 |
| Icons | [Lucide React](https://lucide.dev/) | 0.577 |
| Routing | [React Router](https://reactrouter.com/) | 7.13 |
| Toast Notifications | [Sonner](https://sonner.emilkowal.dev/) | 2.0 |
| Build Tool | [Vite](https://vite.dev/) | 8.0 |

---

## Project Structure

```
github-ai-explorer/
├── src/                        # React frontend
│   ├── components/
│   │   ├── chat/               # Code Q&A panel (RAG-based)
│   │   ├── collection/         # Bookmarks & collections management
│   │   ├── search/             # Search bar, filters, results, comparison, code viewer
│   │   ├── settings/           # Settings page (API keys, theme, language)
│   │   └── ui/                 # Header, onboarding, tooltips, snippet drawer
│   ├── hooks/                  # Custom React hooks (infinite scroll, etc.)
│   ├── lib/                    # Core logic
│   │   ├── ai.ts               # AI provider integration
│   │   ├── github.ts           # GitHub API client
│   │   ├── ollama.ts           # Ollama local AI integration
│   │   ├── code-qa.ts          # RAG-based code Q&A
│   │   ├── health-score.ts     # Repository health scoring
│   │   ├── trending.ts         # Trending dashboard data
│   │   ├── collections.ts      # Collection management
│   │   ├── offline-cache.ts    # Offline mode caching
│   │   ├── ai-benchmark.ts     # AI model benchmarking
│   │   ├── export-import.ts    # JSON export/import
│   │   ├── tauri-bridge.ts     # Tauri IPC bridge
│   │   └── i18n.ts             # Internationalization
│   ├── pages/                  # Route pages
│   │   ├── HomePage.tsx        # Landing page with onboarding
│   │   ├── SearchPage.tsx      # Main search interface
│   │   ├── StatsPage.tsx       # Usage statistics dashboard
│   │   └── TrendingPage.tsx    # Trending repositories
│   ├── stores/                 # Zustand state stores
│   │   ├── app-store.ts        # Main application state
│   │   ├── compare-store.ts    # Repository comparison state
│   │   ├── snippet-store.ts    # Code snippet storage
│   │   └── watch-store.ts      # Repository watch/alert state
│   └── types/                  # TypeScript type definitions
├── src-tauri/                  # Rust backend
│   ├── src/                    # Tauri commands, SQLite operations
│   ├── capabilities/           # Tauri permission capabilities
│   ├── icons/                  # Application icons (ico, icns, png)
│   ├── tauri.conf.json         # Tauri configuration
│   ├── Cargo.toml              # Rust dependencies
│   └── Cargo.lock              # Rust dependency lock file
├── public/                     # Static assets
├── PRD/                        # Product requirement documents
├── package.json                # Node.js dependencies & scripts
├── vite.config.ts              # Vite build configuration (port 7719)
├── tsconfig.json               # TypeScript configuration
└── LICENSE                     # MIT License
```

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server only (frontend at `http://127.0.0.1:7719`) |
| `npm run build` | Build frontend for production |
| `npm run tauri:dev` | Launch full Tauri app in development mode |
| `npm run tauri:build` | Build production installer (.msi + .exe) |
| `npm run lint` | Run ESLint code checks |
| `npm run preview` | Preview production build locally |

### Development Phases

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 (MVP) | AI search, AI summary, tabs, search history, shortcuts, dark mode, settings, SQLite, GitHub auth | Complete (11/11) |
| Phase 2 | Code Q&A, bookmarks, collections, health score, comparison, smart folders, code viewer, advanced filters | Complete (9/9) |
| Phase 3 | Ollama local AI, offline mode, trending dashboard, export, auto-update, cache strategy, benchmarks | Complete (8/8) |

---

## Security

| Concern | How it's handled |
|---------|------------------|
| API Key Storage | Encrypted and stored locally in SQLite on your device only |
| Data Transmission | Keys are sent only to their respective provider's official API endpoint |
| GitHub Token | Stored locally with the same encryption; used exclusively for GitHub API requests |
| Telemetry | None. Zero analytics or tracking. All data stays on your machine. |
| Offline Privacy | Use Ollama for fully offline AI -- no network requests whatsoever |
| Source Code | Fully open source -- inspect and verify everything yourself |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Ensure WebView2 is installed (pre-installed on Windows 10 1803+ and Windows 11) |
| Search returns no results | Check internet connection; verify GitHub token in Settings if rate-limited |
| AI features not working | Verify your API key is correct in Settings; check the selected AI provider |
| Ollama not connecting | Ensure Ollama is running locally (`ollama serve`) and the model is downloaded |
| Build fails on Windows | Install Visual Studio Build Tools 2022 with the "Desktop development with C++" workload |
| First build is very slow | Normal -- Rust compilation takes 5-10 minutes on first run; subsequent builds are fast |
| SmartScreen warning | Click "More info" then "Run anyway" (app is unsigned during development) |

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the existing code style and includes appropriate type definitions.

---

## License

```
MIT License

Copyright (c) 2026 SoDam AI Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

See the full [LICENSE](LICENSE) file for details.

---

## Support

If you encounter issues or have questions, please open an issue on [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues).

---

<p align="center">
  Made with care by <a href="https://github.com/sodam-ai">SoDam AI Studio</a>
</p>
