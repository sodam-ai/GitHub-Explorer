# GitHub AI Explorer

> Search GitHub repositories, code, and issues with AI-powered natural language — right from your desktop.

[Korean (한국어)](./README.ko.md) | [Japanese (日本語)](./README.ja.md) | [Chinese (中文)](./README.zh.md)

---

## What is this?

**GitHub AI Explorer** is a desktop app that lets you search GitHub using everyday language instead of keywords.

Instead of typing `react drag drop library stars:>1000`, you can just type:
> "React drag and drop library with lots of stars and recent updates"

The AI understands what you mean and finds the best results.

---

## Key Features

| Feature | Description |
|---------|-------------|
| AI Search | Type in plain language, get smart results from repositories, code, and issues |
| AI Summary | Every search comes with an AI-generated summary at the top |
| Tabs | Results are organized into Repositories / Code / Issues tabs |
| Bookmarks | Save your favorite repositories to collections |
| Command Palette | Press `Ctrl+K` to quickly search from anywhere in the app |
| Dark/Light Mode | Switch between dark and light themes |
| Local Database | Your search history and settings are saved on your computer |
| GitHub Auth | Connect your GitHub account for higher API limits (60 → 5,000 requests/hour) |
| Settings | Manage your GitHub token and AI API keys in one place |

---

## Screenshots

> Screenshots will be added after the UI is finalized.

---

## How to Install and Run

### What You Need First

Before you start, make sure these are installed on your computer:

| Tool | What it does | How to install |
|------|-------------|----------------|
| **Node.js 20+** | Runs the frontend | Download from [nodejs.org](https://nodejs.org/) |
| **Rust** | Runs the backend | Install from [rustup.rs](https://rustup.rs/) |
| **Git** | Manages code | Download from [git-scm.com](https://git-scm.com/) |

### Step-by-Step Setup

**Step 1: Download the project**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**Step 2: Install packages**
```bash
npm install
```

**Step 3: Run the app**
```bash
npm run tauri dev
```

> The first run takes 5-10 minutes because Rust needs to compile. After that, it starts in seconds.

**Step 4: Set up your API keys**

1. Open the app
2. Click the gear icon (Settings) in the top right
3. Enter your **OpenAI API Key** (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
4. (Optional) Enter your **GitHub Token** for higher API limits (get one at [github.com/settings/tokens](https://github.com/settings/tokens))
5. Click "Save"

**Step 5: Search!**

Type anything in the search bar and press Enter. For example:
- "React table library with sorting"
- "Python FastAPI authentication example"
- "TypeScript state management 2026"

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Command Palette (quick search) |
| `Ctrl+,` | Open Settings |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop Framework | Tauri 2.0 (Rust backend) |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| Local Database | SQLite (via rusqlite) |
| AI | OpenAI API + Ollama (local) |
| Syntax Highlighting | Prism.js |
| Build Tool | Vite 8 |
| Icons | Lucide React |

---

## Project Structure

```
github-ai-explorer/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── pages/              # Pages (Home, Search)
│   ├── stores/             # State management (Zustand)
│   ├── lib/                # API clients (GitHub, AI, Tauri bridge)
│   └── types/              # TypeScript types
├── src-tauri/              # Backend (Rust)
│   ├── src/                # Rust source (commands, database)
│   └── tauri.conf.json     # Tauri configuration
├── PRD/                    # Design documents (6 files)
└── .env                    # API keys (not uploaded to GitHub)
```

---

## Development Phases

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 (MVP) | AI search, AI summary, tabs, history, shortcuts, dark mode, settings, SQLite, GitHub auth | **Complete** (11/11) |
| Phase 2 | Code Q&A, bookmarks, collections, health score, comparison, smart folders, code viewer, filters | **Complete** (9/9) |
| Phase 3 | Local AI (Ollama), offline mode, trending dashboard, export, auto-update, cache strategy | **Complete** (8/8) |

---

## Security

- API keys are stored **locally on your computer** only (SQLite database)
- The `.env` file is in `.gitignore` — it is **never uploaded to GitHub**
- No data is sent to any server except GitHub API and OpenAI API
- All code is open source — you can verify everything

---

## License

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

See [LICENSE](./LICENSE) for details.

---

## Support

If you have questions or find bugs, please open an issue on [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues).
